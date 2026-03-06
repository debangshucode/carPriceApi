import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './reports.entity';
import { CreateReportDto } from './dtos/cretate-report.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private repo: Repository<Report>) { }

    create(reportDto: CreateReportDto, user: User) {
        const report = this.repo.create(reportDto);
        report.user = user;
        return this.repo.save(report);
    }
    getReports() {
        const reports = this.repo.find({
            relations: {
                user: true,
            }
        })
        return reports;
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
