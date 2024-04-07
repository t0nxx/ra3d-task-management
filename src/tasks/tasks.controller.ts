import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuardGuard } from 'src/guards/auth-guard.guard';
import { PaginationParamsDto } from 'src/shared/pagination.dto';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(AuthGuardGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(@Query() pagination: PaginationParamsDto) {
    return this.tasksService.getAllForCurrentUser(pagination);
  }

  @Get('my-assigned')
  findAllAssigned(@Query() pagination: PaginationParamsDto) {
    return this.tasksService.getAllAssignedForCurrentUser(pagination);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
