import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TaskService } from './app.service';
import taskDTO from './dto/task.dto';
import { userSignInDTO } from './dto/user.dto';

@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/tasks/:to')
  async getTasks(
    @Query('page') page: number = 1,
    @Query('limit') limit: number,
    @Query('s') s: string,
    @Param('to') to: string,
  ) {
    console.log("token", to);
    return this.taskService.getTasks(page, limit, s, to);
  }
  @Get('/detail/:id')
  getTaskDetail(@Param('id') id: string) {
    return this.taskService.getTaskDetail(id);
  }
  @Delete('/delete/:id')
  deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask(id);
  }
  @Put('/update/:id')
  updateTask(@Param('id') id: string, @Body() task: taskDTO) {
    return this.taskService.updateTask(id, task);
  }
  @Post('/add/:to')
  addTasks(@Param('to') to: string, @Body() task: taskDTO) {
    return this.taskService.addTask(task, to);
  }
}
