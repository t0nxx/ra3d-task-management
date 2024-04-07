import { OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class SocketGatewayGateway implements OnModuleInit {
  constructor(private eventEmitter: EventEmitter2) {}
  @WebSocketServer() server: Server;

  onModuleInit() {
    this.eventEmitter.on('task.created', (task) => {
      ///'user.user_uuid'
      // emit to creator of the task
      this.server.emit('user-' + task.userId, {
        type: 'task.created',
        data: task,
      });
      // emit to assignee of the task if exist
      task.assignedUserId &&
        this.server.emit('user-' + task.assignedUserId, {
          type: 'task.assigned',
          data: task,
        });
    });

    this.eventEmitter.on('task.updated', (task) => {
      this.server.emit('user-' + task.userId, {
        type: 'task.updated',
        data: task,
      });

      // emit to assignee of the task if exist
      task.assignedUserId &&
        this.server.emit('user-' + task.assignedUserId, {
          type: 'task.updated',
          data: task,
        });
    });
  }
  async handleConnection(socket: Socket): Promise<void> {
    console.log(`Client connected: ${socket.id}`);
  }
}
