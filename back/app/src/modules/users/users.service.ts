import {BadRequestException, Injectable} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {DataSource} from "typeorm";
import {UserEntity} from "./entities/user.entity";
import {CategoryEntity} from "../categories/entities/category.entity";
export type User = any;
@Injectable()
export class UsersService {
  constructor(
    private readonly dataSource: DataSource,
  ) {}

  async findOneByLogin(login: string): Promise<User | undefined> {
    const queryRunner = this.dataSource.createQueryRunner();

    const queryBuilder = this.dataSource
      .getRepository(UserEntity)
      .createQueryBuilder('user', queryRunner);

    await queryRunner.startTransaction();
    const query = queryBuilder
      .select()
      .where('login = :login', { login })
    const result = await query.getOne();
    await queryRunner.commitTransaction();
    await queryRunner.release();
    return result;
  }

  async findOne(id: number): Promise<User | undefined> {

    const queryRunner = this.dataSource.createQueryRunner();

    const queryBuilder = this.dataSource
      .getRepository(UserEntity)
      .createQueryBuilder('user', queryRunner);

    await queryRunner.startTransaction();
    const query = queryBuilder
      .select()
      .where('id = :id', { id })
    const result = await query.getOne();
    await queryRunner.commitTransaction();
    await queryRunner.release();
    return result;
  }

  async create(createUserDto: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const query = this.dataSource
        .createQueryBuilder(queryRunner)
        .insert()
        .into(UserEntity)
        .values(createUserDto)
        .returning('*');

      const dbResult = await query.execute();
      const result = dbResult.raw[0];
      await queryRunner.commitTransaction();
      return result;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
