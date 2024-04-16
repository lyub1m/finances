import {ApiProperty} from "@nestjs/swagger";
import {IsEnum, IsNotEmpty, IsNumber, IsOptional} from "class-validator";
import {Transform} from "class-transformer";

export class CreateAccountDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  public name: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  public color: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  public icon: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Transform(e => Number(e.value))
  public userId: number;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  public currency: string;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  public sum: number;

  @ApiProperty({
    type: Boolean,
    required: false,
  })
  @IsOptional()
  public isDefault: boolean;
}
