import { Injectable } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { DataSource } from "typeorm";
import {CurrencyEntity} from "./entities/currency.entity";

@Injectable()
export class CurrenciesService {
  constructor(
    private readonly dataSource: DataSource,
  ) {}
  create(createCurrencyDto: CreateCurrencyDto) {
    return 'This action adds a new currency';
  }

  async findAll() {
    const queryRunner = this.dataSource.createQueryRunner();

    const queryBuilder = this.dataSource
      .getRepository(CurrencyEntity)
      .createQueryBuilder('currency', queryRunner);

    await queryRunner.startTransaction();
    const query = queryBuilder.select()
    const items = await query.getMany();
    await queryRunner.commitTransaction();
    await queryRunner.release();
    return items;
  }

  findOne(id: number) {
    return `This action returns a #${id} currency`;
  }

  update(id: number, updateCurrencyDto: UpdateCurrencyDto) {
    return `This action updates a #${id} currency`;
  }

  remove(id: number) {
    return `This action removes a #${id} currency`;
  }
}
