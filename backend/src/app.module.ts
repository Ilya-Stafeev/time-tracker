import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Employee } from './employee/employee.entity';
import { Task } from './task/task.entity';
import { EmployeeController } from './employee/employee.controller';
import { EmployeeService } from './employee/employee.service';
import { EmployeeModule } from './employee/employee.module';
import { TaskController } from './task/task.controller';
import { TaskModule } from './task/task.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Employee, Task],
      synchronize: true,
    }),
    EmployeeModule,
    TaskModule,
  ],
  controllers: [AppController, EmployeeController, TaskController],
  providers: [AppService, EmployeeService],
})
export class AppModule {}
