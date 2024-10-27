import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Task } from '../task/task.entity';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  position: string;

  @Column()
  department: string;

  @Column()
  workingHours: string;

  @OneToMany(() => Task, task => task.employee)
  tasks: Task[];
}
