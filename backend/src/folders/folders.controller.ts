import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';

@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  async create(@Body() createFolderDto: CreateFolderDto) {
    return await this.foldersService.create(createFolderDto);
  }

  @Get('movies')
  async getMovieList(
    @Query('userId') userId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page && !isNaN(parseInt(page, 10)) ? parseInt(page, 10) : 1;
    const limitNum = limit && !isNaN(parseInt(limit, 10)) ? parseInt(limit, 10) : 10;
    const validPage = Math.max(1, pageNum);
    const validLimit = Math.min(Math.max(1, limitNum), 100);
    return await this.foldersService.getmovielist(userId, validPage, validLimit);
  }

  @Get()
  async findAll(
    @Query('userId') userId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page && !isNaN(parseInt(page, 10)) ? parseInt(page, 10) : 1;
    const limitNum = limit && !isNaN(parseInt(limit, 10)) ? parseInt(limit, 10) : 10;
    const validPage = Math.max(1, pageNum);
    const validLimit = Math.min(Math.max(1, limitNum), 100);
    return await this.foldersService.findAll(userId, status, validPage, validLimit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.foldersService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateFolderDto: UpdateFolderDto) {
    return await this.foldersService.update(id, updateFolderDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return await this.foldersService.remove(id);
  }
}
