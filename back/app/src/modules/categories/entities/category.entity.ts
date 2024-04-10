import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({ name: 'category' })
export class CategoryEntity {
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
  public type: string;

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
    type: 'timestamp',
    nullable: false,
    name: 'updated_at',
    default: 'now()'
  })
  public updatedAt: string;
}
