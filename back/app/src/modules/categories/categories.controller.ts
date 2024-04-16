import {Controller, Get, Post, Body, Patch, Param, Delete, Query, Request} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {QueryCategoriesDto} from "./dto/query-categories.dto";
import {ApiBearerAuth, ApiSecurity, ApiTags} from "@nestjs/swagger";

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(
    @Request() req: any,
    @Body() createCategoryDto: CreateCategoryDto
  ) {
    const { sub } = req.user || {};
    if (sub) {
      createCategoryDto.userId = sub
    }
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll(
    @Request() req: any,
    @Query() params: QueryCategoriesDto
  ) {
    const { sub } = req.user || {};
    if (sub) {
      params.userId = sub
    }
    return this.categoriesService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const { sub } = req.user || {};
    if (sub) {
      updateCategoryDto.userId = sub
    }
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
