import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './User.entity';
import { ServiceRequest } from './ServiceRequest.entity';

export enum VerificationStatus {
    PENDING = 'PENDING',
    VERIFIED = 'VERIFIED',
    REJECTED = 'REJECTED',
}

@Entity()
export class ServiceProvider {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @OneToOne(() => User, (user) => user.providerProfile)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    category: string;

    @Column({
        type: 'enum',
        enum: VerificationStatus,
        default: VerificationStatus.PENDING,
    })
    verificationStatus: VerificationStatus;

    @Column({ nullable: true })
    ninBvnHash: string;

    @Column({ type: 'float', default: 0 })
    rating: number;

    @Column({ default: true })
    isAvailable: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => ServiceRequest, (request) => request.provider)
    handledRequests: ServiceRequest[];
}
