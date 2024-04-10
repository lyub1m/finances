import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import {RegisterDto} from "./dto/register.dto";
import {CreateUserDto} from "../users/dto/create-user.dto";
import * as bcrypt from "bcrypt";

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
    const isMatch = await bcrypt.compare(password, user?.password);
    if (!isMatch) {
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
      password: await bcrypt.hash(registerDto.password, 10),
      name: registerDto.name,
    })
    const payload = { sub: user.id, username: user.login };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}