import { Injectable } from '@nestjs/common';
import { CreateRegularOperationDto } from './dto/create-regular-operation.dto';
import { UpdateRegularOperationDto } from './dto/update-regular-operation.dto';
import {Brackets, DataSource} from "typeorm";
import {RegularOperationEntity} from "./entities/regular-operation.entity";
import {QueryRegularOperationsDto} from "./dto/query-regular-operations.dto";
import {Cron} from "@nestjs/schedule";
import {PeriodCodes} from "./enums";
import {OperationsService} from "../operations/operations.service";
import {NotificationsService} from "../notifications/notifications.service";

@Injectable()
export class RegularOperationsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly operationsService: OperationsService,
    private readonly notificationsService: NotificationsService,
  ) {}
  async create(createRegularOperationDto: CreateRegularOperationDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      if (createRegularOperationDto.periodCode === PeriodCodes.One) {
        createRegularOperationDto.dateEnd = createRegularOperationDto.dateStart || new Date()
      }
      await queryRunner.startTransaction();
      const query = this.dataSource
        .createQueryBuilder(queryRunner)
        .insert()
        .into(RegularOperationEntity)
        .values(createRegularOperationDto)
        .returning('*');

      const dbResult = await query.execute();
      await queryRunner.commitTransaction();
      return this.findOne(dbResult.raw[0].id);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(params: QueryRegularOperationsDto) {
    const {
      userId,
      time,
      dateStartFrom,
      dateStartTo,
      dateEndFrom,
      dateEndTo,
      isEnabled
    } = params
    const queryRunner = this.dataSource.createQueryRunner();

    const queryBuilder = this.dataSource
      .getRepository(RegularOperationEntity)
      .createQueryBuilder('regular-operation', queryRunner);

    await queryRunner.startTransaction();
    const query = queryBuilder
      .select()
      .leftJoin('regular-operation.category', 'category')
      .addSelect('category')
      .leftJoin('regular-operation.account', 'account')
      .addSelect('account')
      .leftJoin('account.currencyInfo', 'currencyInfo')
      .addSelect('currencyInfo')
      .where('1=1')
      .orderBy('regular-operation.created_at', 'DESC')
    if (userId) {
      query.andWhere('regular-operation.user_id = :userId', {
        userId,
      });
    }
    if (time) {
      query.andWhere('regular-operation.time = :time', {
        time,
      });
    }
    if (isEnabled) {
      query.andWhere('regular-operation.is_enabled = :isEnabled', {
        isEnabled,
      });
    }
    if (dateStartFrom) {
      query.andWhere('regular-operation.date_start >= :dateStartFrom', {
        dateStartFrom,
      });
    }
    if (dateStartTo) {
      query.andWhere('regular-operation.date_start <= :dateStartTo', {
        dateStartTo,
      });
    }
    if (dateEndFrom) {
      query.andWhere(new Brackets((qb) => {
        qb.where('regular-operation.date_end >= :dateEndFrom', {
          dateEndFrom,
        })
          .orWhere('regular-operation.date_end is null')
      }));
    }
    if (dateEndTo) {
      query.andWhere(new Brackets((qb) => {
        qb.where('regular-operation.date_end <= :dateEndTo', {
          dateEndTo,
        })
          .orWhere('regular-operation.date_end is null')
      }));
    }
    const items = await query.getMany();
    await queryRunner.commitTransaction();
    await queryRunner.release();
    return items;
  }

  async findOne(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();

    const queryBuilder = this.dataSource
      .getRepository(RegularOperationEntity)
      .createQueryBuilder('regular-operation', queryRunner);

    await queryRunner.startTransaction();
    const query = queryBuilder
      .select()
      .leftJoin('regular-operation.category', 'category')
      .addSelect('category')
      .leftJoin('regular-operation.account', 'account')
      .addSelect('account')
      .leftJoin('account.currencyInfo', 'currencyInfo')
      .addSelect('currencyInfo')
      .where('regular-operation.id = :id', { id })
    const result = await query.getOne();
    await queryRunner.commitTransaction();
    await queryRunner.release();
    return result;
  }

  async update(id: number, updateRegularOperationDto: UpdateRegularOperationDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const query = this.dataSource
        .createQueryBuilder(queryRunner)
        .update(RegularOperationEntity)
        .set(updateRegularOperationDto)
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
        .from(RegularOperationEntity)
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
  // @Cron('*/5 * * * * *')
  @Cron('1 * * * * *')
  async handleCron() {
    const currentDate = new Date()
    const time = `${`0${currentDate.getHours()}`.substr(-2)}:${`0${currentDate.getMinutes()}`.substr(-2)}`
    // console.log('time >>>>>>>>>>>>>>>>>', time);

    // const time = '00:06'
    const items = await this.findAll({
      time,
      dateStartTo: new Date(),
      dateEndFrom: new Date(),
      isEnabled: true,
    })
    console.log('new Date(), items?.length >>>>>>>>>>>>>>>>>', new Date(), items?.length);

    const currentWeekDay = currentDate.getDay()
    const currentMonthDay = currentDate.getDate()
    const currentMonth = currentDate.getMonth()
    await Promise.all(items.map(async (e: RegularOperationEntity) => {
      let check = false
      const { periodCode, dateStart } = e
      const itemWeekDay = dateStart.getDay()
      const itemMonthDay = dateStart.getDate()
      const itemMonth = dateStart.getMonth()
      switch (periodCode) {
        case PeriodCodes.Day:
        case PeriodCodes.One:
          check = true
          break
        case PeriodCodes.Week:
          if (currentWeekDay === itemWeekDay) {
            check = true
          }
          break
        case PeriodCodes.TwoWeek:
          if ((currentWeekDay - itemWeekDay) % 2 === 0) {
            check = true
          }
          break
        case PeriodCodes.Month:
          if (currentMonthDay === itemMonthDay) {
            check = true
          }
          break
        case PeriodCodes.TwoMonth:
          if (currentMonthDay === itemMonthDay && (currentMonth - itemMonth) % 2 === 0) {
            check = true
          }
          break
        case PeriodCodes.FourMonths:
          if (currentMonthDay === itemMonthDay && (currentMonth - itemMonth) % 4 === 0) {
            check = true
          }
          break
        case PeriodCodes.SixMonths:
          if (currentMonthDay === itemMonthDay && (currentMonth - itemMonth) % 6 === 0) {
            check = true
          }
          break
        case PeriodCodes.Year:
          if (currentMonthDay === itemMonthDay && currentMonth === itemMonth) {
            check = true
          }
          break
        default:
          break
      }
      console.log('check >>>>>>>>>>>>>>>>>', check);
      console.log('periodCode >>>>>>>>>>>>>>>>>', periodCode);

      if (check) {
        await this.operationsService.create({
          accountId: e.accountId,
          categoryId: e.categoryId,
          comment: e.name,
          sum: e.sum,
          createdAt: new Date(),
          userId: e.userId,
        })
        const type = e.category.type === 'out' ? 'Расход' : 'Доход'
        await this.notificationsService.create({
          message: `Добавлен ${type} (${e.category.name}) - ${e.sum} ${e.account.currencyInfo.character}. Счет: ${e.account.name}`,
          userId: e.userId,
        })
      }
    }))
  }
}
