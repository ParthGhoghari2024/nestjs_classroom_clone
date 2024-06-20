import { Module } from '@nestjs/common';
import { AttachService } from './attach.service';
import { AttachController } from './attach.controller';

@Module({
  controllers: [AttachController],
  providers: [AttachService],
})
export class AttachModule {}
