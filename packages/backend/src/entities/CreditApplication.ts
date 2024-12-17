import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('credit_applications')
export class CreditApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('jsonb')
  variables: Record<string, any>;

  @Column()
  workflowId: string;

  @Column({ nullable: true })
  creditScore: number;

  @Column({ 
    type: 'enum',
    enum: ['pending', 'approved', 'rejected', 'review'],
    default: 'pending'
  })
  status: 'pending' | 'approved' | 'rejected' | 'review';

  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}