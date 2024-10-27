import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private notificationsService: NotificationsService,
  ) {}

  async create(employee: Partial<Employee>): Promise<Employee> {
    const newEmployee = await this.employeeRepository.save(employee);
    this.notificationsService.scheduleBreakReminder(newEmployee.id); // Запускаем напоминания
    this.notificationsService.scheduleDailySummary(newEmployee.id); // Запускаем ежедневный отчет
    return newEmployee;
  }

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find();
  }

  async findOne(id: number): Promise<Employee> {
    return this.employeeRepository.findOneBy({ id });
  }
}
