import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import {RegisterDto} from "./dto/register.dto";
import {CreateUserDto} from "../users/dto/create-user.dto";


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.usersService.findOneByLogin(username);
    
    if (password !== user.password) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.login };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async register(registerDto: RegisterDto): Promise<{ accessToken: string }> {
    const { username } = registerDto;
    const exist = await this.usersService.findOneByLogin(username);
    if (exist) {
      throw new BadRequestException(`Пользователь с логином ${username} существует`)
    }
    const user = await this.usersService.create({
      login: registerDto.username,
      password: registerDto.password,
      name: registerDto.name,
    })
    const payload = { sub: user.id, username: user.login };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}