import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    TasksModule,
    UsersModule,
    // simulate localstorage , for share req user object accross the cycle of request
    ClsModule.forRoot({
      middleware: {
        // automatically mount to all routes
        mount: true,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
