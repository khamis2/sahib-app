import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { ServiceRequest, RequestStatus, Priority } from '../entities/ServiceRequest.entity';
import { Transaction, TransactionStatus } from '../entities/Transaction.entity';
import { SimpleJsonDb } from '../lib/mock-db';
import { UsersService } from '../users/users.service';
import { ProvidersService } from '../providers/providers.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestsService {
    private requestsDb = new SimpleJsonDb<ServiceRequest>('requests');
    private transactionsDb = new SimpleJsonDb<Transaction>('transactions');

    constructor(
        private usersService: UsersService,
        @Inject(forwardRef(() => ProvidersService))
        private providersService: ProvidersService,
    ) { }

    async createRequest(userId: string, price: number, priority: Priority, location: any): Promise<ServiceRequest> {
        const user = await this.usersService.findOne(userId);
        if (!user) throw new NotFoundException('User not found');

        if (user.balance < price) {
            throw new BadRequestException('Insufficient balance for escrow');
        }

        // Deduct from user balance
        user.balance -= price;
        await this.usersService.save(user);

        const request = {
            id: uuidv4(),
            userId,
            price,
            priority,
            location,
            status: RequestStatus.PENDING,
            createdAt: new Date(),
            updatedAt: new Date(),
        } as ServiceRequest;

        const savedRequest = await this.requestsDb.saveOne(request);

        // Create Escrow Transaction record
        const transaction = {
            id: uuidv4(),
            requestId: savedRequest.id,
            amount: price,
            status: TransactionStatus.HELD_IN_ESCROW,
            createdAt: new Date(),
            updatedAt: new Date(),
        } as Transaction;

        await this.transactionsDb.saveOne(transaction);

        return savedRequest;
    }

    async acceptRequest(requestId: string, providerId: string): Promise<ServiceRequest> {
        const request = await this.requestsDb.findOne({ id: requestId });
        if (!request) throw new NotFoundException('Request not found');
        if (request.status !== RequestStatus.PENDING) throw new BadRequestException('Request already handled');

        request.providerId = providerId;
        request.status = RequestStatus.ACCEPTED;
        return this.requestsDb.saveOne(request);
    }

    async getAllRequests(): Promise<ServiceRequest[]> {
        const requests = await this.requestsDb.find();
        // Sort by createdAt DESC
        return requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    async completeRequest(requestId: string): Promise<ServiceRequest> {
        const request = await this.requestsDb.findOne({ id: requestId });
        if (!request) throw new NotFoundException('Request not found');
        if (request.status !== RequestStatus.ACCEPTED) throw new BadRequestException('Request must be accepted first');

        request.status = RequestStatus.COMPLETED;
        const savedRequest = await this.requestsDb.saveOne(request);

        // Release Escrow funds
        const transaction = await this.transactionsDb.findOne({ requestId: savedRequest.id });
        if (transaction && request.providerId) {
            transaction.status = TransactionStatus.RELEASED;
            await this.transactionsDb.saveOne(transaction);

            const provider = await this.providersService.findOne(request.providerId);
            if (provider) {
                const providerUser = await this.usersService.findOne(provider.userId);
                if (providerUser) {
                    providerUser.balance = Number(providerUser.balance) + Number(request.price);
                    await this.usersService.save(providerUser);
                }
            }
        }

        return savedRequest;
    }

    async getRequestById(id: string): Promise<ServiceRequest | null> {
        const request = await this.requestsDb.findOne({ id });
        if (!request) {
            return { error: 'Request not found' } as any;
        }
        return request;
    }

    async cancelRequest(id: string): Promise<any> {
        const request = await this.requestsDb.findOne({ id });
        if (!request) {
            return { error: 'Request not found' };
        }

        if (request.status !== RequestStatus.PENDING) {
            return { error: 'Only pending requests can be cancelled' };
        }

        // Refund the user
        const user = await this.usersService.findOne(request.userId);
        if (user) {
            user.balance = Number(user.balance) + Number(request.price);
            await this.usersService.save(user);
        }

        // Update request status
        request.status = RequestStatus.CANCELLED;
        await this.requestsDb.saveOne(request);

        // Update transaction status
        const transaction = await this.transactionsDb.findOne({ requestId: id });
        if (transaction) {
            transaction.status = TransactionStatus.REFUNDED;
            await this.transactionsDb.saveOne(transaction);
        }

        return {
            success: true,
            message: 'Request cancelled and refund processed',
            refundAmount: request.price
        };
    }

    async getAvailableRequests(): Promise<ServiceRequest[]> {
        const requests = await this.requestsDb.find();
        return requests
            .filter(r => r.status === RequestStatus.PENDING && !r.providerId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    async rateRequest(requestId: string, rating: number, review?: string): Promise<any> {
        const request = await this.requestsDb.findOne({ id: requestId });
        if (!request) throw new NotFoundException('Request not found');

        if (request.status !== RequestStatus.COMPLETED) {
            throw new BadRequestException('Can only rate completed requests');
        }

        request.rating = rating;
        if (review) request.review = review;

        await this.requestsDb.saveOne(request);

        return { success: true, message: 'Rating submitted successfully' };
    }
}
