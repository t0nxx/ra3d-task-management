import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { CoreModule } from 'src/core/core.module';
import { ClsModule } from 'nestjs-cls';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [CoreModule, ClsModule],
})
export class TasksModule {}
