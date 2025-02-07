import { Module } from '@nestjs/common';
import { TaskController } from './app.controller';
import { TaskService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { taskSchema } from './schema/task.model';
import { config } from 'dotenv';
import { userSchema } from './schema/user.model';
// import { AuthModule } from './auth/auth.module';
import UserController from './user/user.controller';
import UserService from './user/user.service';
import AuthController from './user/auth/auth.controller';
import { AuthService } from './user/auth/auth.service';
config();
@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.CONN_URI}`),
    MongooseModule.forFeature([
      { name: 'tasks', schema: taskSchema },
      { name: 'users', schema: userSchema },
    ]),
    // AuthModule,
  ],
  controllers: [TaskController, UserController, AuthController],
  providers: [TaskService, UserService, AuthService],
})
export class AppModule {}
