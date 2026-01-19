import { Injectable } from '@nestjs/common';
import { User } from '../entities/User.entity';
import { SimpleJsonDb } from '../lib/mock-db';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
    private db = new SimpleJsonDb<User>('users');

    async findByPhone(phoneNumber: string): Promise<User | null> {
        return (await this.db.findOne({ phoneNumber })) || null;
    }

    async findByEmail(email: string): Promise<User | null> {
        return (await this.db.findOne({ email })) || null;
    }

    async create(userData: Partial<User>): Promise<User> {
        const user = {
            id: uuidv4(),
            phoneNumber: '',
            email: '',
            fullName: '',
            balance: 0,
            role: 'USER' as any,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...userData,
        } as User;
        return this.db.saveOne(user);
    }

    async findOne(id: string): Promise<User | null> {
        return (await this.db.findOne({ id })) || null;
    }

    async save(user: User): Promise<User> {
        return this.db.saveOne(user);
    }

    async getTransactions(userId: string): Promise<any[]> {
        // We'll need to inject a Transaction service or DB here, but for now 
        // let's assume we can access a transactions DB directly or via a simple file read
        // Since we don't have a TransactionsService injected yet, let's quick-fix by using SimpleJsonDb directly
        const transactionsDb = new SimpleJsonDb<any>('transactions');
        const allTransactions: any[] = await transactionsDb.find({});

        // Filter by userId (either as sender or strictly related)
        // For our simplified model, we might need to look up requests first or assume transactions have userId
        // But our Transaction entity links to Request, which links to User.
        // So we need to join.

        // Optimized approach: Get all user's requests first
        const requestsDb = new SimpleJsonDb<any>('requests');
        const userRequests: any[] = await requestsDb.find({ userId });
        const requestIds = userRequests.map(r => r.id);

        const relevantTransactions = allTransactions.filter(t =>
            requestIds.includes(t.requestId) || t.userId === userId // t.userId for direct funding
        );

        return relevantTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
}
