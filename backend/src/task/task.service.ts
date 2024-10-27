import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Task } from './task.entity';

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(task: Partial<Task>): Promise<Task> {
    return this.taskRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find({ relations: ['employee'] });
  }

  async findOne(id: number): Promise<Task> {
    return this.taskRepository.findOneBy({ id });
  }

  async startTask(id: number): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) throw new Error('Task not found');

    task.startTime = new Date(); // Устанавливаем время начала
    return this.taskRepository.save(task);
  }

  async stopTask(id: number): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) throw new Error('Task not found');

    task.endTime = new Date(); // Устанавливаем время окончания

    // Учитываем время работы
    if (task.startTime) {
      const start = new Date(task.startTime);
      const end = new Date(task.endTime);
      task.workDuration += Math.floor((end.getTime() - start.getTime()) / 1000 / 60); // Время в минутах
    }
    
    return this.taskRepository.save(task);
  }

  async addBreak(id: number, duration: number): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) throw new Error('Task not found');
    
    task.breaks += duration; // Увеличиваем общее время перерывов
    return this.taskRepository.save(task);
  }

  async remove(id: number): Promise<void> {
    await this.taskRepository.delete(id);
  }

  async getStatistics(employeeId: number): Promise<any> {
    const tasks = await this.taskRepository.find({
      where: { employee: { id: employeeId } },
    });

    const totalDuration = tasks.reduce((total, task) => total + task.workDuration, 0);
    const totalBreaks = tasks.reduce((total, task) => total + task.breaks, 0);

    return {
      totalWorkDuration: totalDuration,
      totalBreaks: totalBreaks,
      totalTasks: tasks.length,
    };
  }

  async generateReport(employeeId: number): Promise<string> {
        const tasks = await this.taskRepository.find({ where: { employee: { id: employeeId } } });

        const reportContent = tasks.map(task => ({
            title: task.title,
            description: task.description,
            workDuration: task.workDuration,
            breaks: task.breaks,
        }));

        const csvContent = reportContent.map(task => 
            `${task.title},${task.description},${task.workDuration},${task.breaks}`
        ).join('\n');

        const filePath = path.join(__dirname, 'reports', `report_${employeeId}.csv`);
        fs.writeFileSync(filePath, csvContent);
        return filePath;
    }

    async getStatisticsForDay(employeeId: number): Promise<any> {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
    
        const tasks = await this.taskRepository.find({
          where: {
            employee: { id: employeeId },
            startTime: MoreThanOrEqual(startOfDay),
            endTime: LessThanOrEqual(endOfDay),
          },
        });
    
        const totalWorkDuration = tasks.reduce((total, task) => total + task.workDuration, 0);
        const totalBreaks = tasks.reduce((total, task) => total + task.breaks, 0);
    
        return {
          totalWorkDuration,
          totalBreaks,
          tasks,
        };
    }
}
