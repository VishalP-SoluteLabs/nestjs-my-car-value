import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule .forRoot({
      isGlobal: true,
      envFilePath: '.env.development'
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {    //configService is to access .env file and variables
        return {
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: config.get<string>('DB_USERNAME'),
            password: config.get<string>('DB_PWD'),
            database: config.get<string>('DB_NAME'),
            entities: [User, Report],
            synchronize: true,
          }
      }
    }),
    UsersModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
