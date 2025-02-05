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

@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/tasks')
  async getTasks(
    @Query('page') page: number = 1,
    @Query('limit') limit: number,
    @Query('s') s: string ,
  ) {
    console.log(s);
    return this.taskService.getTasks(page, limit, s);
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
  @Post('/add')
  addTasks(@Body() task: taskDTO) {
    return this.taskService.addTask(task);
  }
}
