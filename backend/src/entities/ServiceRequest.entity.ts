import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne } from 'typeorm';
import { User } from './User.entity';
import { ServiceProvider } from './ServiceProvider.entity';
import { Transaction } from './Transaction.entity';

export enum RequestStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export enum Priority {
    NORMAL = 'NORMAL',
    URGENT = 'URGENT',
    EXPRESS = 'EXPRESS',
}

@Entity()
export class ServiceRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, (user) => user.requests)
    user: User;

    @Column({ nullable: true })
    providerId: string;

    @ManyToOne(() => ServiceProvider, (provider) => provider.handledRequests)
    provider: ServiceProvider;

    @Column({
        type: 'varchar',
        default: RequestStatus.PENDING,
    })
    status: RequestStatus;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    price: number;

    @Column({
        type: 'varchar',
        default: Priority.NORMAL,
    })
    priority: Priority;

    @Column({ type: 'simple-json' })
    location: { lat: number; lng: number; address: string };

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => Transaction, (transaction) => transaction.request)
    transaction: Transaction;

    @Column({ nullable: true })
    rating: number;

    @Column({ nullable: true })
    review: string;
}
