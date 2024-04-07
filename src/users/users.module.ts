import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CoreModule } from 'src/core/core.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET, JWT_EXPIRES_IN } from 'src/constants';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [
    CoreModule,
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_EXPIRES_IN },
    }),
  ],
})
export class UsersModule {}
