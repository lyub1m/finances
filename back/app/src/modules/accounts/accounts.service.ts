import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import {CategoryEntity} from "../categories/entities/category.entity";
import {DataSource} from "typeorm";
import {AccountEntity} from "./entities/account.entity";
import {QueryAccountsDto} from "./dto/query-accounts.dto";

@Injectable()
export class AccountsService {
  constructor(
    private readonly dataSource: DataSource,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const query = this.dataSource
        .createQueryBuilder(queryRunner)
        .insert()
        .into(AccountEntity)
        .values(createAccountDto)
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

  async findAll(params: QueryAccountsDto) {
    const { userId } = params
    const queryRunner = this.dataSource.createQueryRunner();

    const queryBuilder = this.dataSource
      .getRepository(AccountEntity)
      .createQueryBuilder('account', queryRunner);

    await queryRunner.startTransaction();
    const query = queryBuilder
      .select()
      .leftJoin('account.currencyInfo', 'currencyInfo')
      .addSelect('currencyInfo')
      .orderBy('account.updated_at', 'DESC')
    if (userId) {
      query.andWhere('account.user_id = :userId', {
        userId,
      });
    }
    const items = await query.getMany();
    await queryRunner.commitTransaction();
    await queryRunner.release();
    return items;
  }

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  async update(id: number, updateAccountDto: UpdateAccountDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const query = this.dataSource
        .createQueryBuilder(queryRunner)
        .update(AccountEntity)
        .set(updateAccountDto)
        .where('id = :id', { id })
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

  async remove(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const query = this.dataSource
        .createQueryBuilder(queryRunner)
        .delete()
        .from(AccountEntity)
        .where('id = :id', { id });

      await query.execute();
      await queryRunner.commitTransaction();
      return true;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
