import { Module } from '@nestjs/common';
import { RegularOperationsService } from './regular-operations.service';
import { RegularOperationsController } from './regular-operations.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {RegularOperationEntity} from "./entities/regular-operation.entity";
import {OperationsModule} from "../operations/operations.module";
import {NotificationsModule} from "../notifications/notifications.module";

@Module({
  imports: [
    OperationsModule,
    NotificationsModule,
    TypeOrmModule.forFeature([RegularOperationEntity]),
  ],
  controllers: [RegularOperationsController],
  providers: [RegularOperationsService],
})
export class RegularOperationsModule {}
