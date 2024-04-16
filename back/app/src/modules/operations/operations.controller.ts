import {Controller, Get, Post, Body, Patch, Param, Delete, Query, Request} from '@nestjs/common';
import { OperationsService } from './operations.service';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import {QueryOperationsDto} from "./dto/query-operations.dto";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('operations')
@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Post()
  create(
    @Request() req: any,
    @Body() createOperationDto: CreateOperationDto
  ) {
    const { sub } = req.user || {};
    if (sub) {
      createOperationDto.userId = sub
    }
    return this.operationsService.create(createOperationDto);
  }

  @Get()
  findAll(
    @Request() req: any,
    @Query() params: QueryOperationsDto
  ) {
    const { sub } = req.user || {};
    if (sub) {
      params.userId = sub
    }
    return this.operationsService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.operationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOperationDto: UpdateOperationDto) {
    return this.operationsService.update(+id, updateOperationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.operationsService.remove(+id);
  }
}
