import {ApiProperty} from "@nestjs/swagger";
import {IsDate, IsNotEmpty, IsOptional} from "class-validator";

export class CreateOperationDto {
  @ApiProperty({
    type: Number,
    required: true,
    example: 100,
  })
  @IsNotEmpty()
  sum: number;

  @ApiProperty({
    type: Number,
    required: true,
    example: 2,
  })
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty({
    type: Number,
    required: true,
    example: 2,
  })
  @IsNotEmpty()
  accountId: number;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  comment: string;

  @ApiProperty({
    type: Number,
    required: false,
    example: 1,
  })
  @IsOptional()
  userId: number;

  @IsDate()
  @ApiProperty({
    type: Date,
    required: false,
  })
  @IsOptional()
  createdAt: Date;
}
