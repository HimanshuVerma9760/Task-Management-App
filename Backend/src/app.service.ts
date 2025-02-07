import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import taskDTO from './dto/task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { taskSchema } from './schema/task.model';
import { userDTO } from './dto/user.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel('tasks') private taskModel: Model<taskDTO>,
    @InjectModel('users') private userModel: Model<userDTO>,
  ) {}

  async getTasks(page: number, limit: number, s: string, to: string) {
    const skip = (page - 1) * limit;
    const key = process.env.SECRET_KEY || 'Himanshu2512';
    let allTasks: any;
    let totalTasks: number;
    console.log('verified Token:');
    const verifiedToken: any = jwt.verify(to, key);
    console.log('verified Token: ', verifiedToken);
    if (s === 'Low' || s === 'Medium' || s === 'High') {
      allTasks = await this.taskModel
        .find({ taskPriority: s, creator: verifiedToken.id })
        .skip(skip)
        .limit(limit)
        .exec();
      totalTasks = await this.taskModel
        .find({ taskPriority: s, creator: verifiedToken.id })
        .countDocuments()
        .exec();
    } else {
      allTasks = await this.taskModel
        .find({ creator: verifiedToken.id })
        .skip(skip)
        .limit(limit)
        .exec();
      totalTasks = await this.taskModel.find({ creator: verifiedToken.id }).countDocuments().exec();
    }
    if (allTasks) {
      if (allTasks.length > 0) {
        return { allTasks, totalTasks };
      } else {
        console.log('No Tasks found');
        throw new HttpException('No Tasks Found!!', 404);
      }
    } else {
      throw new HttpException('Internal Server Error!!', 500);
    }
  }
  async getTaskDetail(id: String): Promise<typeof taskSchema | {}> {
    const Task = await this.taskModel.findById(id).exec();
    if (Task) {
      return Task;
    } else {
      throw new HttpException('No Task Found', 404);
    }
  }
  async updateTask(id: string, task: taskDTO): Promise<any> {
    let findTask: any;
    try {
      findTask = await this.taskModel.find({ taskName: task.taskName });
    } catch (err) {}
    try {
      if (findTask.length > 0) {
        console.log('Duplicate entry!', findTask);
        throw new HttpException('Duplicate tasks!!', 404);
      } else {
        const result = await this.taskModel.updateOne(
          { _id: id },
          { $set: task },
        );
        if (!result) {
          throw new HttpException('Task not found!', 404);
        }
        const response = await this.taskModel.findById(id);
        console.log(response);
        return response;
      }
    } catch (error) {
      throw new HttpException('Error occurred while updating task!', 500);
    }
  }
  async deleteTask(id: string): Promise<any> {
    try {
      const result = await this.taskModel.findByIdAndDelete(id);
      if (result) {
        return result;
      } else {
        throw new HttpException('failed to delete', 404);
      }
    } catch (error) {
      console.log(error);
      throw new HttpException('Internal server error!', 500);
    }
  }
  async addTask(myTask: taskDTO, to: string): Promise<any> {
    const key = process.env.SECRET_KEY || 'Himanshu2512';
    let verifiedToken: any;
    try {
      verifiedToken = jwt.verify(to, key);
    } catch (error) {
      throw new UnauthorizedException('Unauthorized!');
    }
    try {
      const newTask = {
        ...myTask,
        creator: verifiedToken.id,
      };
      const task = new this.taskModel(newTask);
      const result = await task.save();
      if (result) {
        console.log('');
        const userTask = await this.userModel.findByIdAndUpdate(
          verifiedToken.id,
          {
            $push: {
              tasks: result._id,
            },
          },
        );
        console.log(userTask);
        return result;
      } else {
        throw new HttpException('Error while Adding Task!', 404);
      }
    } catch (error) {
      console.log(error);
      throw new HttpException('Some Error Occured while adding task!', 404);
    }
  }
}
