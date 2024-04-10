import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {QueryCategoriesDto} from "./dto/query-categories.dto";
import {Brackets, DataSource} from "typeorm";
import {CategoryEntity} from "./entities/category.entity";

@Injectable()
export class CategoriesService {
  constructor(
    private readonly dataSource: DataSource,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const query = this.dataSource
        .createQueryBuilder(queryRunner)
        .insert()
        .into(CategoryEntity)
        .values(createCategoryDto)
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

  async findAll(params: QueryCategoriesDto) {
    const { type, userId } = params

    const queryRunner = this.dataSource.createQueryRunner();

    const queryBuilder = this.dataSource
      .getRepository(CategoryEntity)
      .createQueryBuilder('category', queryRunner);

    await queryRunner.startTransaction();
    const query = queryBuilder
      .select()
      .where('1=1')
      .orderBy('updated_at', 'DESC')
    if (type) {
      query.andWhere('type = :type', { type })
    }
    if (userId) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('user_id = :userId', {
            userId,
          })
            .orWhere('user_id is null');
        }),
      );
    }
    const items = await query.getMany();
    await queryRunner.commitTransaction();
    await queryRunner.release();
    return items;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const query = this.dataSource
        .createQueryBuilder(queryRunner)
        .update(CategoryEntity)
        .set(updateCategoryDto)
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
        .from(CategoryEntity)
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
