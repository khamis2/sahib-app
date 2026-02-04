import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/User.entity';
import { ServiceProvider } from './entities/ServiceProvider.entity';
import { ServiceRequest } from './entities/ServiceRequest.entity';
import { Transaction } from './entities/Transaction.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProvidersModule } from './providers/providers.module';
import { RequestsModule } from './requests/requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL') || 'postgresql://postgres:postgres@localhost:5432/sahib_services?schema=public',
        entities: [User, ServiceProvider, ServiceRequest, Transaction],
        synchronize: true, // Auto-create tables (set to false in production once stable)
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        logging: process.env.NODE_ENV !== 'production',
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ProvidersModule,
    RequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
