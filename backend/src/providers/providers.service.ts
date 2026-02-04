import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceProvider, VerificationStatus } from '../entities/ServiceProvider.entity';
import { Role } from '../entities/User.entity';
import { UsersService } from '../users/users.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProvidersService {
    constructor(
        @InjectRepository(ServiceProvider)
        private providerRepository: Repository<ServiceProvider>,
        private usersService: UsersService,
    ) { }

    async create(userId: string, category: string): Promise<ServiceProvider> {
        const user = await this.usersService.findOne(userId);
        if (!user) throw new NotFoundException('User not found');

        const provider = this.providerRepository.create({
            id: uuidv4(),
            userId,
            category,
            verificationStatus: VerificationStatus.PENDING,
            isAvailable: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return await this.providerRepository.save(provider);
    }

    async findByUserId(userId: string): Promise<ServiceProvider | null> {
        return await this.providerRepository.findOne({ where: { userId } });
    }

    async verifyProvider(providerId: string, status: VerificationStatus, ninBvnHash?: string): Promise<ServiceProvider> {
        const provider = await this.providerRepository.findOne({ where: { id: providerId } });
        if (!provider) throw new NotFoundException('Provider not found');

        provider.verificationStatus = status;
        if (ninBvnHash) provider.ninBvnHash = ninBvnHash;
        provider.updatedAt = new Date();

        if (status === VerificationStatus.VERIFIED) {
            const user = await this.usersService.findOne(provider.userId);
            if (user) {
                user.role = Role.PROVIDER;
                await this.usersService.save(user);
            }
        }

        return await this.providerRepository.save(provider);
    }

    async updateAvailability(providerId: string, isAvailable: boolean): Promise<ServiceProvider> {
        const provider = await this.providerRepository.findOne({ where: { id: providerId } });
        if (!provider) throw new NotFoundException('Provider not found');

        provider.isAvailable = isAvailable;
        provider.updatedAt = new Date();
        return await this.providerRepository.save(provider);
    }

    async findAllActive(): Promise<ServiceProvider[]> {
        return await this.providerRepository.find({
            where: {
                isAvailable: true,
                verificationStatus: VerificationStatus.VERIFIED,
            },
        });
    }

    async findOne(id: string): Promise<ServiceProvider | null> {
        return await this.providerRepository.findOne({ where: { id } });
    }
}
