import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {CurrencyEntity} from "../../currencies/entities/currency.entity";
import {Transform} from "class-transformer";

@Entity({ name: 'account' })
export class AccountEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'decimal',
    nullable: true,
    name: 'user_id',
  })
  public userId: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  public name: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  public color: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  public icon: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  public currency: string;

  @OneToOne(() => CurrencyEntity)
  @JoinColumn({ name: 'currency' })
  public currencyInfo: CurrencyEntity;

  @Column({
    type: 'integer',
    nullable: false,
  })
  public sum: number;


  @Column({
    type: 'integer',
    nullable: false,
    name: 'is_default',
  })
  public isDefault: boolean;

  @Column({
    type: 'timestamp',
    nullable: false,
    name: 'updated_at',
    default: 'now()'
  })
  public updatedAt: string;
}
