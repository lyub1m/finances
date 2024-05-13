import {ApiProperty} from "@nestjs/swagger";
import {Transform} from "class-transformer";
import {IsDate, IsEnum, IsNumber, IsOptional} from "class-validator";
import {Type} from "../../categories/dto/query-categories.dto";

export class QueryNotificationsDto {
  @IsOptional()
  @ApiProperty({
    type: Number,
    required: false,
    example: 1,
  })
  userId?: number;
}
