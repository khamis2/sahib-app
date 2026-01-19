import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { ServiceProvider } from '../entities/ServiceProvider.entity';
import { User } from '../entities/User.entity';
import { UsersModule } from '../users/users.module'; // Assuming UsersModule is needed

@Module({
    imports: [UsersModule],
    providers: [ProvidersService],
    controllers: [ProvidersController],
    exports: [ProvidersService],
})
export class ProvidersModule { }
