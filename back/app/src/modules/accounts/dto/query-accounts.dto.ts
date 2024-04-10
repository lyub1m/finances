import {ApiProperty} from "@nestjs/swagger";
import {Transform} from "class-transformer";
import {IsDate, IsEnum, IsNumber, IsOptional} from "class-validator";
import {Type} from "../../categories/dto/query-categories.dto";

export class QueryAccountsDto {
  @IsOptional()
  @ApiProperty({
    type: Number,
    required: false,
  })
  userId: number;
}
