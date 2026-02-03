import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany } from 'typeorm';
import { ServiceProvider } from './ServiceProvider.entity';
import { ServiceRequest } from './ServiceRequest.entity';

export enum Role {
  USER = 'USER',
  PROVIDER = 'PROVIDER',
  ADMIN = 'ADMIN',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({ unique: true })
  email: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({
    type: 'varchar',
    default: Role.USER,
  })
  role: Role;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  balance: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => ServiceProvider, (provider) => provider.user)
  providerProfile: ServiceProvider;

  @OneToMany(() => ServiceRequest, (request) => request.user)
  requests: ServiceRequest[];
}
