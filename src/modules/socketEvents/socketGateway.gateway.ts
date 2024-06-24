import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';

//socket module just for boilerplate
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketEventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  onMessage(@MessageBody() data: any) {
    console.log(data);
  }

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    console.log('events got :', data);

    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }
}
