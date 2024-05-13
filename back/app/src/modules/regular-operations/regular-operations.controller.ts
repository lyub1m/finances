import {Controller, Get, Post, Body, Patch, Param, Delete, Query, Request} from '@nestjs/common';
import { RegularOperationsService } from './regular-operations.service';
import { CreateRegularOperationDto } from './dto/create-regular-operation.dto';
import { UpdateRegularOperationDto } from './dto/update-regular-operation.dto';
import {ApiTags} from "@nestjs/swagger";
import {QueryRegularOperationsDto} from "./dto/query-regular-operations.dto";

@ApiTags('regular-operations')
@Controller('regular-operations')
export class RegularOperationsController {
  constructor(private readonly regularOperationsService: RegularOperationsService) {}

  @Post()
  create(
    @Request() req: any,
    @Body() createRegularOperationDto: CreateRegularOperationDto
  ) {
    const { sub } = req.user || {};
    if (sub) {
      createRegularOperationDto.userId = sub
    }
    return this.regularOperationsService.create(createRegularOperationDto);
  }

  @Get()
  findAll(
    @Request() req: any,
    @Query() params: QueryRegularOperationsDto
  ) {
    const { sub } = req.user || {};
    if (sub) {
      params.userId = sub
    }
    return this.regularOperationsService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regularOperationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegularOperationDto: UpdateRegularOperationDto) {
    return this.regularOperationsService.update(+id, updateRegularOperationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.regularOperationsService.remove(+id);
  }
}
