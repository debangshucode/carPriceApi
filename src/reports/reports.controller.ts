import { Body, Controller, Post, UseGuards, Get, Patch, Param, Query } from '@nestjs/common';
import { CreateReportDto } from './dtos/cretate-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { ReportDto } from './dtos/report.dto';
import { serialize } from 'src/interceptors/serialize.interceptor';
import { UpdateReportDto } from './dtos/update-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { Paginate } from 'nestjs-paginate';
import type { PaginateQuery } from 'nestjs-paginate'
import { plainToInstance } from 'class-transformer';

@Controller('reports')
export class ReportsController {
    constructor(private reportService: ReportsService) { }

    @Get()
    getEstimate(@Query() query: GetEstimateDto) {
        return this.reportService.getEstimate(query)
    }

    @Post()
    @UseGuards(AuthGuard)
    @serialize(ReportDto)
    createReports(@Body() body: CreateReportDto, @CurrentUser() user: User) {
        return this.reportService.create(body, user)
    }

    @Get('/all-reports')
    async getReports(@Paginate() query: PaginateQuery) {
        const result = await this.reportService.getReports(query);
        console.log(result)
        return {
            ...result,
            data: plainToInstance(ReportDto, result.data, {
                excludeExtraneousValues: true,
            }),
        };
    }

    @Patch('/:id/approve')
    @UseGuards(AdminGuard)
    approveReports(@Param('id') id: string) {
        const report = this.reportService.approveReport(id, true);
        return report;
    }
    @Patch('/:id/reject')
    @UseGuards(AdminGuard)
    rejectReports(@Param('id') id: string) {
        const report = this.reportService.approveReport(id, false);
        return report
    }

    @Get('/:id')
    findReport(@Param('id') id: string) {
        return this.reportService.findOne(id);
    }

    @Patch('/:id')
    updateReports(@Param('id') id: string, @Body() body: UpdateReportDto) {
        return this.reportService.updateReport(id, body);
    }
}
