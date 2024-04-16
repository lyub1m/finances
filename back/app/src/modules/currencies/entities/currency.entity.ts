import {Column, Entity} from "typeorm";

@Entity({ name: 'currency' })
export class CurrencyEntity {
  @Column({
    type: 'varchar',
    nullable: false,
    primary: true,
  })
  code: string;
  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;
  @Column({
    type: 'varchar',
    nullable: true,
  })
  character: string;
  @Column({
    type: 'float',
    nullable: false,
  })
  rate: number;
}
