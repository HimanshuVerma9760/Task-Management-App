import { HttpException, Injectable } from '@nestjs/common';
import taskDTO from './dto/task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { taskSchema } from './schema/task.model';

@Injectable()
export class TaskService {
  constructor(@InjectModel('tasks') private taskModel: Model<taskDTO>) {}

  async getTasks(page: number, limit: number, s: string) {
    const skip = (page - 1) * limit;
    let allTasks: any;
    let totalTasks: number;
    if (s === 'Low' || s === 'Medium' || s === 'High') {
      allTasks = await this.taskModel
        .find({ taskPriority: s })
        .skip(skip)
        .limit(limit)
        .exec();
      totalTasks = await this.taskModel
        .find({ taskPriority: s })
        .countDocuments()
        .exec();
    } else {
      allTasks = await this.taskModel.find().skip(skip).limit(limit).exec();
      totalTasks = await this.taskModel.countDocuments().exec();
    }
    if (allTasks) {
      if (allTasks.length > 0) {
        return { allTasks, totalTasks };
      } else {
        console.log('No user found');
        return new HttpException('No User Found!!', 202);
      }
    } else {
      return new HttpException('Internal Server Error!!', 500);
    }
  }
  async getTaskDetail(id: String): Promise<typeof taskSchema | {}> {
    const Task = await this.taskModel.findById(id).exec();
    if (Task) {
      return Task;
    } else {
      return new HttpException('No Task Found', 404);
    }
  }
  async updateTask(id: string, task: taskDTO): Promise<any> {
    let findTask: any;
    try {
      findTask = await this.taskModel.find({ taskName: task.taskName });
    } catch (err) {}
    try {
      if (findTask.length>0) {
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
        return new HttpException('failed to delete', 404);
      }
    } catch (error) {
      console.log(error);
      return new HttpException('Internal server error!', 500);
    }
  }
  async addTask(myTask: taskDTO): Promise<any> {
    const task = new this.taskModel(myTask);
    try {
      const result = await task.save();
      if (result) {
        return result;
      } else {
        return new HttpException('Error while Adding Task!', 404);
      }
    } catch (error) {
      console.log(error);
      return new HttpException('Some Error Occured while adding task!', 404);
    }
  }
}
