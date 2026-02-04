import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceRequest, RequestStatus, Priority } from '../entities/ServiceRequest.entity';
import { Transaction, TransactionStatus } from '../entities/Transaction.entity';
import { UsersService } from '../users/users.service';
import { ProvidersService } from '../providers/providers.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestsService {
    constructor(
        @InjectRepository(ServiceRequest)
        private requestRepository: Repository<ServiceRequest>,
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
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

        const request = this.requestRepository.create({
            id: uuidv4(),
            userId,
            price,
            priority,
            location,
            status: RequestStatus.PENDING,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const savedRequest = await this.requestRepository.save(request);

        // Create Escrow Transaction record
        const transaction = this.transactionRepository.create({
            id: uuidv4(),
            requestId: savedRequest.id,
            amount: price,
            status: TransactionStatus.HELD_IN_ESCROW,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await this.transactionRepository.save(transaction);

        return savedRequest;
    }

    async acceptRequest(requestId: string, providerId: string): Promise<ServiceRequest> {
        const request = await this.requestRepository.findOne({ where: { id: requestId } });
        if (!request) throw new NotFoundException('Request not found');
        if (request.status !== RequestStatus.PENDING) throw new BadRequestException('Request already handled');

        request.providerId = providerId;
        request.status = RequestStatus.ACCEPTED;
        return await this.requestRepository.save(request);
    }

    async getAllRequests(): Promise<ServiceRequest[]> {
        return await this.requestRepository.find({
            order: { createdAt: 'DESC' },
        });
    }

    async completeRequest(requestId: string): Promise<ServiceRequest> {
        const request = await this.requestRepository.findOne({ where: { id: requestId } });
        if (!request) throw new NotFoundException('Request not found');
        if (request.status !== RequestStatus.ACCEPTED) throw new BadRequestException('Request must be accepted first');

        request.status = RequestStatus.COMPLETED;
        const savedRequest = await this.requestRepository.save(request);

        // Release Escrow funds
        const transaction = await this.transactionRepository.findOne({ where: { requestId: savedRequest.id } });
        if (transaction && request.providerId) {
            transaction.status = TransactionStatus.RELEASED;
            await this.transactionRepository.save(transaction);

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
        const request = await this.requestRepository.findOne({ where: { id } });
        if (!request) {
            return { error: 'Request not found' } as any;
        }
        return request;
    }

    async cancelRequest(id: string): Promise<any> {
        const request = await this.requestRepository.findOne({ where: { id } });
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
        await this.requestRepository.save(request);

        // Update transaction status
        const transaction = await this.transactionRepository.findOne({ where: { requestId: id } });
        if (transaction) {
            transaction.status = TransactionStatus.REFUNDED;
            await this.transactionRepository.save(transaction);
        }

        return {
            success: true,
            message: 'Request cancelled and refund processed',
            refundAmount: request.price
        };
    }

    async getAvailableRequests(): Promise<ServiceRequest[]> {
        return await this.requestRepository.find({
            where: {
                status: RequestStatus.PENDING,
            },
            order: { createdAt: 'DESC' },
        });
    }

    async rateRequest(requestId: string, rating: number, review?: string): Promise<any> {
        const request = await this.requestRepository.findOne({ where: { id: requestId } });
        if (!request) throw new NotFoundException('Request not found');

        if (request.status !== RequestStatus.COMPLETED) {
            throw new BadRequestException('Can only rate completed requests');
        }

        request.rating = rating;
        if (review) request.review = review;

        await this.requestRepository.save(request);

        return { success: true, message: 'Rating submitted successfully' };
    }
}
