import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import {Transform} from "class-transformer";

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @Transform(e => e.value && new Date(e.value) || new Date())
  updatedAt: Date = new Date()
}
