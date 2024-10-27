import { Injectable } from '@nestjs/common';
import * as schedule from 'node-schedule';
import { TaskService } from 'src/task/task.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class NotificationsService {
    constructor(
        private readonly taskService: TaskService,
      ) {}
    scheduleBreakReminder(employeeId: number) {
        schedule.scheduleJob('*/30 * * * *', function() { // Каждые 30 минут
            console.log(`Время сделать перерыв, сотрудник ${employeeId}`);
        });
    }

    // Планировщик для ежедневного отчета
  scheduleDailySummary(employeeId: number) {
    schedule.scheduleJob('0 18 * * *', async () => { // Запуск каждый день в 18:00
      console.log(`Суммарный отчет за день для сотрудника ${employeeId}`);
      const report = await this.generateDailyReport(employeeId);
      
      // Сохранение отчета в файл
      const filePath = path.join(__dirname, 'reports', `daily_report_${employeeId}_${new Date().toISOString().split('T')[0]}.txt`);
      fs.writeFileSync(filePath, report);

      console.log(`Отчет сохранен в ${filePath}`);
    });
  }

  // Генерация ежедневного отчета
  async generateDailyReport(employeeId: number): Promise<string> {
    const stats = await this.taskService.getStatisticsForDay(employeeId);
    const { totalWorkDuration, totalBreaks, tasks } = stats;

    let report = `Ежедневный отчет для сотрудника ${employeeId}\n`;
    report += `Дата: ${new Date().toLocaleDateString()}\n\n`;
    report += `Общее время работы: ${totalWorkDuration} минут\n`;
    report += `Время перерывов: ${totalBreaks} минут\n\n`;
    report += `Детали задач:\n`;

    tasks.forEach((task, index) => {
      report += `${index + 1}. ${task.title}\n`;
      report += `   Описание: ${task.description}\n`;
      report += `   Время работы: ${task.workDuration} минут\n`;
      report += `   Время перерывов: ${task.breaks} минут\n\n`;
    });

    return report;
  }
}
