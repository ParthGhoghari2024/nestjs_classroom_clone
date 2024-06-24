import { Module } from '@nestjs/common';
import { SocketEventsGateway } from './socketGateway.gateway';

//socket module just for boilerplate
@Module({
  providers: [SocketEventsGateway],
})
export class SocketEventsModule {}
