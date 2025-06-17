import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './schemas/task.schema';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Patch(':id/assign/:staffId')
  async assign(@Param('id') id: string, @Param('staffId') staffId: string) {
    return this.tasksService.assignTask(id, staffId);
  }

  @Patch(':id/status/:status')
  async updateStatus(
    @Param('id') id: string,
    @Param('status') status: TaskStatus,
  ) {
    return this.tasksService.updateStatus(id, status);
  }
}
