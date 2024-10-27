import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

    @Post()
    create(@Body() task: Partial<Task>) {
        return this.taskService.create(task);
    }

    @Get()
    findAll() {
        return this.taskService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.taskService.findOne(id);
    }

    @Post(':id/start')
    async startTask(@Param('id') id: number) {
        return this.taskService.startTask(id);
    }

    @Post(':id/stop')
    async stopTask(@Param('id') id: number) {
        return this.taskService.stopTask(id);
    }

    @Post(':id/break')
    async addBreak(@Param('id') id: number, @Body('duration') duration: number) {
        return this.taskService.addBreak(id, duration);
    }

    @Get(':employeeId/statistics')
    async getStatistics(@Param('employeeId') employeeId: number) {
        return this.taskService.getStatistics(employeeId);
    }

    @Get(':employeeId/report')
    async generateReport(@Param('employeeId') employeeId: number) {
        return this.taskService.generateReport(employeeId);
    }
}
