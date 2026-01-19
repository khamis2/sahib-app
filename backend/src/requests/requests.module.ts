import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestsService } from './requests.service';
import { UsersModule } from '../users/users.module';
import { ProvidersModule } from '../providers/providers.module';
import { RequestsController } from './requests.controller';
import { ServiceRequest } from '../entities/ServiceRequest.entity';
import { Transaction } from '../entities/Transaction.entity';
import { User } from '../entities/User.entity';

@Module({
    imports: [UsersModule, ProvidersModule],
    providers: [RequestsService],
    controllers: [RequestsController],
    exports: [RequestsService],
})
export class RequestsModule { }
