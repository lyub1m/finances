import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { DataSource } from "typeorm";
import {NotificationEntity} from "./entities/notification.entity";
import {QueryNotificationsDto} from "./dto/query-notifications.dto";

@Injectable()
export class NotificationsService {
  constructor(
    private readonly dataSource: DataSource,
  ) {}
  async create(createNotificationDto: CreateNotificationDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const query = this.dataSource
        .createQueryBuilder(queryRunner)
        .insert()
        .into(NotificationEntity)
        .values(createNotificationDto)
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

  async findAll(params: QueryNotificationsDto) {
    const { userId } = params
    const queryRunner = this.dataSource.createQueryRunner();

    const queryBuilder = this.dataSource
      .getRepository(NotificationEntity)
      .createQueryBuilder('notifications', queryRunner);

    await queryRunner.startTransaction();
    const query = queryBuilder
      .select()
      .where('1=1')
      .orderBy('notifications.created_at', 'DESC')
    if (userId) {
      query.andWhere('notifications.user_id = :userId', {
        userId,
      });
    }
    const items = await query.getMany();
    await queryRunner.commitTransaction();
    await queryRunner.release();
    return items;
  }
  async findUnreadCount(params: QueryNotificationsDto) {
    const { userId } = params
    const queryRunner = this.dataSource.createQueryRunner();

    const queryBuilder = this.dataSource
      .getRepository(NotificationEntity)
      .createQueryBuilder('notifications', queryRunner);

    await queryRunner.startTransaction();
    const query = queryBuilder
      .select()
      .where('notifications.is_read = false')
      .orderBy('notifications.created_at', 'DESC')
    if (userId) {
      query.andWhere('notifications.user_id = :userId', {
        userId,
      });
    }
    const count = await query.getCount();
    await queryRunner.commitTransaction();
    await queryRunner.release();
    return count;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto) {

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const query = this.dataSource
        .createQueryBuilder(queryRunner)
        .update(NotificationEntity)
        .set(updateNotificationDto)
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

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
