import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ClsService } from 'nestjs-cls';
import { PrismaService } from 'src/core/prisma.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly db: PrismaService,
    private readonly appStorage: ClsService,
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
    return task;
  }

  async findOne(id: number) {
    const task = await this.db.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException('task Not Found');
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.db.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException('task Not Found');
    }
    // update task , ownership check
    const currentUser = this.appStorage.get('user');
    if (currentUser.id !== task.userId) {
      throw new UnauthorizedException('Sorry you are not the owner');
    }
    await this.db.task.update({
      where: { id },
      data: updateTaskDto,
    });
    return task;
  }

  async remove(id: number) {
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

  async getAllForCurrentUser() {
    const currentUser = this.appStorage.get('user');

    const tasks = await this.db.task.findMany({
      where: { userId: currentUser?.id },
    });

    return tasks;
  }

  async getAllAssignedForCurrentUser() {
    const currentUser = this.appStorage.get('user');

    const tasks = await this.db.task.findMany({
      where: { assignedUserId: currentUser?.id },
    });

    return tasks;
  }

  private async checkUserIdIsExist(id: number) {
    const task = await this.db.user.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException('Assigned User Not Found');
    }
  }
}
