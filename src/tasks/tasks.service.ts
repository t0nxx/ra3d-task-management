import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ClsService } from 'nestjs-cls';
import { PrismaService } from 'src/core/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TasksService {
  constructor(
    private readonly db: PrismaService,
    private readonly appStorage: ClsService,
    private eventEmitter: EventEmitter2,
  ) {}
  async create(createTaskDto: CreateTaskDto) {
    // get current user id
    const currentUser = this.appStorage.get('user');
    // validate assigned  user is exist or not
    createTaskDto.assignedUserId &&
      (await this.checkUserIdIsExist(createTaskDto.assignedUserId));

    const task = await this.db.task.create({
      data: { userId: currentUser?.id, ...createTaskDto },
    });

    // emit the event to the listner to send notification via websocket
    this.eventEmitter.emit('task.created', task);
    return task;
  }

  async findOne(id: string) {
    const task = await this.db.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException('task Not Found');
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.db.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException('task Not Found');
    }
    // update task , ownership check
    const currentUser = this.appStorage.get('user');
    if (
      !(currentUser.id == task.userId) &&
      !(currentUser.id == task.assignedUserId)
    ) {
      throw new UnauthorizedException(
        'Sorry you are not the owner or assignee',
      );
    }

    // validate assigned  user is exist or not
    updateTaskDto.assignedUserId &&
      (await this.checkUserIdIsExist(updateTaskDto.assignedUserId));

    const updated = await this.db.task.update({
      where: { id },
      data: updateTaskDto,
    });
    // emit the event to the listner to send notification via websocket
    this.eventEmitter.emit('task.updated', updated);
    return updated;
  }

  async remove(id: string) {
    const task = await this.db.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException('task Not Found');
    }
    // delete task , add auth check , ownership check
    const currentUser = this.appStorage.get('user');
    if (currentUser.id !== task.userId) {
      throw new UnauthorizedException('Sorry you are not the owner');
    }
    await this.db.task.delete({ where: { id } });
    return 'succssfully deleted';
  }

  async getAllForCurrentUser(pagination) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;

    const currentUser = this.appStorage.get('user');

    const tasks = await this.db.task.findMany({
      where: { userId: currentUser?.id },
      take: limit,
      skip: (page - 1) * limit,
    });

    return tasks;
  }

  async getAllAssignedForCurrentUser(pagination) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;

    const currentUser = this.appStorage.get('user');

    const tasks = await this.db.task.findMany({
      where: { assignedUserId: currentUser?.id },
      take: limit,
      skip: (page - 1) * limit,
    });

    return tasks;
  }

  private async checkUserIdIsExist(id: string) {
    const task = await this.db.user.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException('Assigned User Not Found');
    }
  }
}
