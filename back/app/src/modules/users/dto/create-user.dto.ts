import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  login: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  name: string;
}
