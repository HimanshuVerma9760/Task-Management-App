import { Test, TestingModule } from '@nestjs/testing';
import {  TaskController } from './app.controller';
import { TaskService } from './app.service';

describe('AppController', () => {
  let appController: TaskController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [TaskService],
    }).compile();

    appController = app.get<TaskController>(TaskController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(TaskController.getHello()).toBe('Hello World!');
    });
  });
});
