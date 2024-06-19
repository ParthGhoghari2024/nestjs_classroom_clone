import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AttachementsEntityService } from './attachementsEntity.service';
import { CreateAttachementsEntityDto } from './dto/createAttachementsEntity.dto';
import { UpdateAttachementsEntityDto } from './dto/updateAttachementsEntity.dto';

@Controller('attachements-entity')
export class AttachementsEntityController {
  constructor(
    private readonly attachementsEntityService: AttachementsEntityService,
  ) {}

  @Post()
  create(@Body() createAttachementsEntityDto: CreateAttachementsEntityDto) {
    return this.attachementsEntityService.create(createAttachementsEntityDto);
  }

  @Get()
  findAll() {
    return this.attachementsEntityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attachementsEntityService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttachementsEntityDto: UpdateAttachementsEntityDto,
  ) {
    return this.attachementsEntityService.update(
      +id,
      updateAttachementsEntityDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attachementsEntityService.remove(+id);
  }
}
