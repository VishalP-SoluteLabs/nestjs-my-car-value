import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Report) private repo: Repository<Report>
    ){}

    createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto){
        return this.repo.createQueryBuilder()
                         .select('AVG(price)', 'price')
                         .where('make = :make', { make })
                         .andWhere('model = :model', { model })  //'and where' because simple .where() will override the prvious where, it will not consider that 
                         .andWhere('lng - :lng BETWEEN -5 and 5', { lng })   //current longitude minus longitude in query (lng - lngInQuery) also range should be in -5 to +5 of the resultant answer
                         .andWhere('lat - :lat BETWEEN -5 and 5', { lat })   //same as above
                         .andWhere('year - :year BETWEEN -3 and 3', { year })
                         .orderBy('ABS(mileage - :mileage)', 'DESC')
                         .setParameters({ mileage })  // to order by mileage, as orderBy doesn't except variable as an argument as like where
                         .limit(3)
                         .getRawOne()
    }

    create(reportDto: CreateReportDto, user: User){
        const report = this.repo.create(reportDto);
        report.user = user;

        return this.repo.save(report);
    }

    async changeApproval(id: string, approved: boolean){
        const report = await this.repo.findOne({ where: { id: parseInt(id) }}); 
        if(!report){
            const error = new NotFoundException('Report Not Found')
            throw error;
        }

       report.approved = approved;
       return this.repo.save(report);
    }
}
