import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './reports.entity';
import { CreateReportDto } from './dtos/cretate-report.dto';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { paginate, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private repo: Repository<Report>) { }

    create(reportDto: CreateReportDto, user: User) {
        const report = this.repo.create(reportDto);
        report.user = user;
        return this.repo.save(report);
    }

    getEstimate(estimateDto:GetEstimateDto){
        return this.repo.createQueryBuilder()
        .select('AVG(price)','price')
        .where('make =:make', { make:estimateDto.make})
        .andWhere('model=:model' ,{model:estimateDto.model})
        .andWhere('lat-:lat BETWEEN -5 AND 5',{lat:estimateDto.lat})
        .andWhere('lng-:lng BETWEEN -5 AND 5',{lng:estimateDto.lng})
        .andWhere('year-:year BETWEEN -3 AND 3',{year:estimateDto.year})
        .andWhere('approve IS TRUE')
        .orderBy('ABS(milage-:milage)','DESC')
        .setParameters({milage:estimateDto.milage})
        .limit(3)
        .getRawOne()
    }

    getReports(query: PaginateQuery) {
        // const reports = this.repo.find({
        //     relations: {
        //         user: true,
        //     }
        // })
        return paginate(query,this.repo, {
            relations:['user'],
            sortableColumns:['id'],
            defaultSortBy:[['id','DESC']]
        });
    }
    async findOne(id: string) {
        const report = await this.repo.findOne({ where: { id: parseInt(id) } })
        if (!report) throw new NotFoundException('report not exist ');

        return report;
    }
    async approveReport(id: string, status: boolean) {
        const report = await this.findOne(id);
        report.approve = status;
        return this.repo.save(report);
    }

    async updateReport(id: string, body: Partial<Report>) {
        const user = await this.findOne(id)
        Object.assign(user, body);
        user.approve=false;
        return this.repo.save(user);
    }
}
