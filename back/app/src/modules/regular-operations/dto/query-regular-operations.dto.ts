import {ApiProperty} from "@nestjs/swagger";
import {Transform} from "class-transformer";
import {IsDate, IsEnum, IsNumber, IsOptional} from "class-validator";
import {Type} from "../../categories/dto/query-categories.dto";

export class QueryRegularOperationsDto {
  @IsOptional()
  @ApiProperty({
    type: Number,
    required: false,
    example: 1,
  })
  userId?: number;

  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
  })
  time?: string;

  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
  })
  dateStartFrom?: Date;

  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
  })
  dateStartTo?: Date;

  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
  })
  dateEndFrom?: Date;

  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
  })
  dateEndTo?: Date;

  @IsOptional()
  @ApiProperty({
    type: Boolean,
    required: false,
  })
  isEnabled?: boolean;
}
