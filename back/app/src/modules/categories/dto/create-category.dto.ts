import {IsEnum, IsNotEmpty, IsNumber, IsOptional} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {Type} from "./query-categories.dto";
import {Transform} from "class-transformer";

export class CreateCategoryDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    enum: Type,
  })
  @IsEnum(Type)
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  color: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  icon: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Transform(e => Number(e.value))
  userId: number;
}
