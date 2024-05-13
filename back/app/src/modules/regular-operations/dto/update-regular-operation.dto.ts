import { PartialType } from '@nestjs/mapped-types';
import { CreateRegularOperationDto } from './create-regular-operation.dto';
import {IsOptional} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UpdateRegularOperationDto extends PartialType(CreateRegularOperationDto) {
  @IsOptional()
  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
  })
  isEnabled?: boolean;
}
