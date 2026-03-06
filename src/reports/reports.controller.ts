import { Body, Controller, Post, UseGuards, Get,Patch,Param} from '@nestjs/common';
import { CreateReportDto } from './dtos/cretate-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { ReportDto } from './dtos/report.dto';
import { serialize } from 'src/interceptors/serialize.interceptor';
import { UpdateReportDto } from './dtos/update-report.dto';
@Controller('reports')
export class ReportsController {
    constructor(private reportService: ReportsService) { }

    @Post()
    @UseGuards(AuthGuard)
    @serialize(ReportDto)
    createReports(@Body() body: CreateReportDto, @CurrentUser() user: User) {
        return this.reportService.create(body, user)
    }

    @Get()
    @serialize(ReportDto)
    getReports() {
        return this.reportService.getReports();
    }

    @Patch('/:id/approve')
    approveReports(@Param('id') id:string){
        const report = this.reportService.approveReport(id,true);
        return report ;
    }
    @Patch('/:id/reject')
    rejectReports(@Param('id') id:string){
        const report = this .reportService.approveReport(id,false);
        return report
    }

    @Get('/:id')
    findReport(@Param('id') id:string){
        return this.reportService.findOne(id);
    }

    @Patch('/:id')
    updateReports(@Param('id') id:string , @Body() body:UpdateReportDto){
        return this.reportService.updateReport(id,body);
    }
}
