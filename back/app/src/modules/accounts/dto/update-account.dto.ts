import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-account.dto';
import {Transform} from "class-transformer";

export class UpdateAccountDto extends PartialType(CreateAccountDto) {
  @Transform(e => e.value && new Date(e.value) || new Date())
  updatedAt?: Date = new Date()
}
