import {ApiProperty} from "@nestjs/swagger";
import {Transform} from "class-transformer";
import {IsDate, IsEnum, IsNumber, IsOptional} from "class-validator";
import {Type} from "../../categories/dto/query-categories.dto";

export class QueryOperationsDto {
  @IsOptional()
  @IsDate()
  @Transform((e) => new Date(e.value))
  @ApiProperty({
    type: Date,
    description: 'Дата создания от',
    required: false,
  })
  dateFrom: Date;
  @IsOptional()
  @IsDate()
  @Transform((e) => {
    const date = new Date(e.value)
    date.setDate(date.getDate() + 1)
    return date;
  })
  @ApiProperty({
    type: Date,
    description: 'Дата создания до',
    required: false,
  })
  dateTo: Date;

  @IsEnum(Type)
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'Тип',
    required: false,
    enum: Type,
  })
  type: string;

  @IsOptional()
  @IsNumber()
  @Transform(e => Number(e.value))
  @ApiProperty({
    type: Number,
    description: 'Id категории',
    required: false,
  })
  categoryId: number;
  @IsOptional()
  @ApiProperty({
    type: Number,
    required: false,
  })
  userId: number;
}
