import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({ name: 'notification' })
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  message: string;

  @Column({
    type: 'decimal',
    nullable: true,
    name: 'user_id',
  })
  userId: number;

  @Column({
    type: 'boolean',
    nullable: true,
    name: 'is_read'
  })
  isRead: boolean;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'created_at'
  })
  createdAt?: Date;
}
