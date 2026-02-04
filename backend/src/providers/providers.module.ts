import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvidersService } from './providers.service';
import { SmsService } from './sms.service';
import { ProvidersController } from './providers.controller';
import { ServiceProvider } from '../entities/ServiceProvider.entity';
import { User } from '../entities/User.entity';
import { UsersModule } from '../users/users.module'; // Assuming UsersModule is needed

@Module({
    imports: [UsersModule, TypeOrmModule.forFeature([ServiceProvider])],
    providers: [ProvidersService, SmsService],
    controllers: [ProvidersController],
    exports: [ProvidersService, SmsService],
})
export class ProvidersModule { }
