import { Injectable, Logger } from '@nestjs/common';
import { WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@Injectable()
@WebSocketGateway({ 
  path: '/notification/',
  cors: { 
    origin: '*',
  },
  transports: ['websocket']
})
export class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger('WEBSOCKET');

  @WebSocketServer() 
  server: Server;

  constructor() {
  }

  afterInit(server: Server) {
    this.logger.log('notification gateway Initialized');
  }

  sendToAll(msg: string) {
    this.server.emit('notificationToClient', { type: 'notification', message: msg });
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`notification client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`notification client disconnected: ${client.id}`);
  }
}