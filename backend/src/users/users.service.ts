import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/User.entity';
import { Transaction } from '../entities/Transaction.entity';
import { ServiceRequest } from '../entities/ServiceRequest.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async findByPhone(phoneNumber: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { phoneNumber } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { email } });
    }

    async create(userData: Partial<User>): Promise<User> {
        const user = this.userRepository.create({
            id: uuidv4(),
            phoneNumber: '',
            email: '',
            fullName: '',
            balance: 0,
            role: 'USER' as any,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...userData,
        });
        return await this.userRepository.save(user);
    }

    async findOne(id: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { id } });
    }

    async save(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }

    async getTransactions(userId: string): Promise<any[]> {
        // This will need to be properly implemented with Transaction repository
        // For now, return empty array - will be fixed when TransactionsModule is created
        // TODO: Inject TransactionRepository and query with proper relations
        return [];
    }
}
