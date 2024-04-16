import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {CategoryEntity} from "../../categories/entities/category.entity";
import {AccountEntity} from "../../accounts/entities/account.entity";

@Entity({ name: 'operation' })
export class OperationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'decimal',
    nullable: true,
  })
  sum: number;


  @Column({
    type: 'decimal',
    nullable: true,
    name: 'category_id',
  })
  categoryId: number;

  @OneToOne(() => CategoryEntity)
  @JoinColumn({ name: 'category_id' })
  public category: CategoryEntity;

  @Column({
    type: 'decimal',
    nullable: true,
    name: 'account_id',
  })
  accountId: number;

  @OneToOne(() => AccountEntity)
  @JoinColumn({ name: 'account_id' })
  public account: AccountEntity;

  @Column({
    type: 'decimal',
    nullable: true,
    name: 'user_id',
  })
  userId: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  comment: string;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'created_at',
  })
  createdAt: Date;
}
