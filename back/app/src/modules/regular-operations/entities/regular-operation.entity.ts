import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {OperationEntity} from "../../operations/entities/operation.entity";

@Entity({ name: 'regular_operation' })
export class RegularOperationEntity extends OperationEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'period_code',
  })
  periodCode: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  time: string;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'date_start',
  })
  dateStart: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'date_end',
  })
  dateEnd: Date;

  @Column({
    type: 'boolean',
    nullable: true,
    name: 'is_enabled',
  })
  isEnabled?: boolean;
}
