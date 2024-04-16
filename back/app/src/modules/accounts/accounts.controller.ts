import {Controller, Get, Post, Body, Patch, Param, Delete, Request, Query} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import {ApiTags} from "@nestjs/swagger";
import {QueryAccountsDto} from "./dto/query-accounts.dto";

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(
    @Body() createAccountDto: CreateAccountDto,
    @Request() req: any,
  ) {
    const { sub } = req.user || {};
    if (sub) {
      createAccountDto.userId = sub
    }
    return this.accountsService.create(createAccountDto);
  }

  @Get()
  findAll(
    @Request() req: any,
    @Query() params: QueryAccountsDto
  ) {
    const { sub } = req.user || {};
    if (sub) {
      params.userId = sub
    }
    return this.accountsService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountsService.update(+id, updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountsService.remove(+id);
  }
}
