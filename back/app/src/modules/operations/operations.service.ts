import { Injectable } from '@nestjs/common';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import {QueryOperationsDto} from "./dto/query-operations.dto";
import {DataSource} from "typeorm";
import {OperationEntity} from "./entities/operation.entity";
import {AccountsService} from "../accounts/accounts.service";

@Injectable()
export class OperationsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly accountsService: AccountsService,
  ) {}
  async create(createOperationDto: CreateOperationDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const query = this.dataSource
        .createQueryBuilder(queryRunner)
        .insert()
        .into(OperationEntity)
        .values(createOperationDto)
        .returning('*');

      const dbResult = await query.execute();
      await queryRunner.commitTransaction();

      const result = await this.findOne(dbResult.raw[0].id);

      const accountId = result?.account?.id;
      const accountSum = result?.account?.sum;
      const type = result?.category?.type
      const operationSum = result.sum

      await this.accountsService.update(accountId, {
        updatedAt: new Date(),
        sum: accountSum + (operationSum * (type === 'out' ? -1 : +1)),
      })
      return result;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(params: QueryOperationsDto) {
    const { dateTo, dateFrom, type, categoryId, userId } = params
    const queryRunner = this.dataSource.createQueryRunner();

    const queryBuilder = this.dataSource
      .getRepository(OperationEntity)
      .createQueryBuilder('operation', queryRunner);

    await queryRunner.startTransaction();
    const query = queryBuilder
      .select()
      .leftJoin('operation.category', 'category')
      .addSelect('category')
      .leftJoin('operation.account', 'account')
      .addSelect('account')
      .leftJoin('account.currencyInfo', 'currencyInfo')
      .addSelect('currencyInfo')
      .where('1=1')
      .orderBy('operation.created_at', 'DESC')
    if (type) {
      query.andWhere('category.type = :type', { type })
    }
    if (userId) {
      query.andWhere('operation.user_id = :userId', {
        userId,
      });
    }
    if (categoryId) {
      query.andWhere('category_id = :categoryId', {
        categoryId,
      });
    }
    if (dateFrom) {
      query.andWhere('operation.created_at >= :dateFrom', {
        dateFrom,
      });
    }
    if (dateTo) {
      query.andWhere('operation.created_at < :dateTo', {
        dateTo,
      });
    }
    const items = await query.getMany();
    await queryRunner.commitTransaction();
    await queryRunner.release();
    return items;
  }

  async findOne(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();

    const queryBuilder = this.dataSource
      .getRepository(OperationEntity)
      .createQueryBuilder('operation', queryRunner);

    await queryRunner.startTransaction();
    const query = queryBuilder
      .select()
      .leftJoin('operation.category', 'category')
      .addSelect('category')
      .leftJoin('operation.account', 'account')
      .addSelect('account')
      .where('operation.id = :id', { id })
    const result = await query.getOne();
    await queryRunner.commitTransaction();
    await queryRunner.release();
    return result;
  }

  async update(id: number, updateOperationDto: UpdateOperationDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const query = this.dataSource
        .createQueryBuilder(queryRunner)
        .update(OperationEntity)
        .set(updateOperationDto)
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
    const operation = await this.findOne(id)
    try {
      await queryRunner.startTransaction();
      const query = this.dataSource
        .createQueryBuilder(queryRunner)
        .delete()
        .from(OperationEntity)
        .where('id = :id', { id });

      await query.execute();

      const accountId = operation?.account?.id;
      const accountSum = operation?.account?.sum;
      const type = operation?.category?.type
      const operationSum = operation.sum


      await this.accountsService.update(accountId, {
        updatedAt: new Date(),
        sum: accountSum + (operationSum * (type === 'out' ? 1 : -1)),
      })

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
