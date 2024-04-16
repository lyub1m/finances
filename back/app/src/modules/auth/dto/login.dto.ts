import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class LoginDto {
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
}
