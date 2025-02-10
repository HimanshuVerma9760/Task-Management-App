import { Module } from '@nestjs/common';
import { TaskController } from './app.controller';
import { TaskService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { taskSchema } from './schema/task.model';
import { config } from 'dotenv';
import { userSchema } from './schema/user.model';
import UserController from './user/user.controller';
import UserService from './user/user.service';
import AuthController from './user/auth/auth.controller';
import { AuthService } from './user/auth/auth.service';
import { adminSchema } from './schema/admin.model';
import AdminController from './admin/admin.controller';
import AdminService from './admin/admin.service';
import AdminAuthController from './admin/auth/auth.controller';
import AdminAuthService from './admin/auth/auth.service';
config();
@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.CONN_URI}`),
    MongooseModule.forFeature([
      { name: 'tasks', schema: taskSchema },
      { name: 'users', schema: userSchema },
      { name: 'admin', schema: adminSchema },
    ]),
  ],
  controllers: [TaskController, UserController, AuthController, AdminController, AdminAuthController],
  providers: [TaskService, UserService, AuthService, AdminService, AdminAuthService],
})
export class AppModule {}
