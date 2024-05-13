import {CreateOperationDto} from "../../operations/dto/create-operation.dto";
import {ApiProperty} from "@nestjs/swagger";
import {IsDate, IsDateString, IsEnum, IsNotEmpty, IsOptional, Matches} from "class-validator";
import {PeriodCodes} from "../enums";
import {Transform} from "class-transformer";

export class CreateRegularOperationDto extends CreateOperationDto {
  @ApiProperty({
    type: String,
    required: true,
    enum: PeriodCodes,
    example: PeriodCodes.Month,
  })
  @IsEnum(PeriodCodes)
  @IsNotEmpty()
  periodCode: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'test',
  })
  @IsNotEmpty()
  name: string;

  @Matches('[0-9]{2}\:[0-9]{2}')
  @ApiProperty({
    type: String,
    required: true,
    example: '12:30',
  })
  @IsNotEmpty()
  time: string;

  @ApiProperty({
    type: Date,
    required: false,
    example: '2024-05-05T23:17:17.155Z',
    default: new Date()
  })
  @Transform(e => new Date(e.value))
  @IsDate()
  dateStart: Date;

  @ApiProperty({
    type: Date,
    required: false,
    example: new Date(),
  })
  @Transform(e => new Date(e.value))
  @IsOptional()
  @IsDate()
  dateEnd?: Date;
}
