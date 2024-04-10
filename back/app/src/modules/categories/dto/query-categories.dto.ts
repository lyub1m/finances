import {ApiProperty} from "@nestjs/swagger";
import {Transform} from "class-transformer";
import {IsDate, IsEnum, IsNumber, IsOptional} from "class-validator";

export enum Type {
  OUT = 'out',
  IN = 'in'
}

export class QueryCategoriesDto {
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
  @ApiProperty({
    type: Number,
    required: false,
  })
  userId: number;
}
