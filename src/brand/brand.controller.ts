import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseArrayPipe,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { SearchBrandDto } from './dto/search-brand.dto';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  create(@Body() createBrand: CreateBrandDto) {
    return this.brandService.create(createBrand);
  }

  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  @Get('search')
  search(@Query() query: SearchBrandDto) {
    return this.brandService.lookUp(query);
  }

  @Get(':ids')
  findSome(@Param('ids', ParseArrayPipe) ids: number[]) {
    return this.brandService.findSome(ids);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(+id, updateBrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandService.remove(+id);
  }
}
