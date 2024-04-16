import { Module } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {OperationEntity} from "./entities/operation.entity";
import {AccountsModule} from "../accounts/accounts.module";

@Module({
  imports: [
    AccountsModule,
    TypeOrmModule.forFeature([OperationEntity]),
  ],
  controllers: [OperationsController],
  providers: [OperationsService],
})
export class OperationsModule {}
