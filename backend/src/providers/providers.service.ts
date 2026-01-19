import { Injectable, NotFoundException } from '@nestjs/common';
import { ServiceProvider, VerificationStatus } from '../entities/ServiceProvider.entity';
import { Role } from '../entities/User.entity';
import { SimpleJsonDb } from '../lib/mock-db';
import { UsersService } from '../users/users.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProvidersService {
    private db = new SimpleJsonDb<ServiceProvider>('providers');

    constructor(
        private usersService: UsersService,
    ) { }

    async create(userId: string, category: string): Promise<ServiceProvider> {
        const user = await this.usersService.findOne(userId);
        if (!user) throw new NotFoundException('User not found');

        const provider = {
            id: uuidv4(),
            userId,
            category,
            verificationStatus: VerificationStatus.PENDING,
            isAvailable: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        } as ServiceProvider;

        return this.db.saveOne(provider);
    }

    async verifyProvider(providerId: string, status: VerificationStatus, ninBvnHash?: string): Promise<ServiceProvider> {
        const provider = await this.db.findOne({ id: providerId });
        if (!provider) throw new NotFoundException('Provider not found');

        provider.verificationStatus = status;
        if (ninBvnHash) provider.ninBvnHash = ninBvnHash;

        if (status === VerificationStatus.VERIFIED) {
            const user = await this.usersService.findOne(provider.userId);
            if (user) {
                user.role = Role.PROVIDER;
                await this.usersService.save(user);
            }
        }

        return this.db.saveOne(provider);
    }

    async findAllActive(): Promise<ServiceProvider[]> {
        const all = await this.db.find();
        return all.filter(p => p.isAvailable && p.verificationStatus === VerificationStatus.VERIFIED);
    }

    async findOne(id: string): Promise<ServiceProvider | null> {
        return (await this.db.findOne({ id })) || null;
    }
}
