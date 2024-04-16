import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class RegisterDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'test',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'test',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'test',
  })
  @IsNotEmpty()
  name: string;
}
