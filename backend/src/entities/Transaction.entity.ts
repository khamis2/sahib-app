import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { ServiceRequest } from './ServiceRequest.entity';

export enum TransactionStatus {
    HELD_IN_ESCROW = 'HELD_IN_ESCROW',
    RELEASED = 'RELEASED',
    REFUNDED = 'REFUNDED',
}

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    requestId: string;

    @OneToOne(() => ServiceRequest, (request) => request.transaction)
    @JoinColumn({ name: 'requestId' })
    request: ServiceRequest;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    amount: number;

    @Column({
        type: 'enum',
        enum: TransactionStatus,
        default: TransactionStatus.HELD_IN_ESCROW,
    })
    status: TransactionStatus;

    @Column({ nullable: true, unique: true })
    paymentRef: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
