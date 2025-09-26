import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { TodoRepository } from './repositories/todo.repository';
import { Todo, TodoDocument } from './schemas/todo.schema';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todoRepository.create(createTodoDto);
  }

  async findAll(): Promise<Todo[]> {
    return this.todoRepository.findAll();
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new NotFoundException(`Todo with ID "${id}" not found`);
    }
    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const updatedTodo = await this.todoRepository.update(id, updateTodoDto);

    if (!updatedTodo) {
      throw new NotFoundException(`Todo with ID "${id}" not found`);
    }
    return updatedTodo;
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.todoRepository.delete(id);
      if (!result) {
        throw new NotFoundException(`Todo with ID "${id}" not found`);
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Error deleting todo with ID "${id}": ${error.message}`,
      );
    }
  }

  async findByStatus(completed: boolean): Promise<Todo[]> {
    return this.todoRepository.findByStatus(completed);
  }

  async findByTags(tags: string[]): Promise<Todo[]> {
    return this.todoRepository.findByTags(tags);
  }

  async search(searchText: string): Promise<Todo[]> {
    return this.todoRepository.search(searchText);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Todo[]> {
    return this.todoRepository.findByDateRange(startDate, endDate);
  }

  async exists(id: string): Promise<boolean> {
    return this.todoRepository.exists(id);
  }

  async countByStatus( search?: string) : Promise<{total: number, done: number, open: number}> {
    return this.todoRepository.countByStatus(search);
  }

  async getList(filter: { completed?: string, search?: string }): Promise<Todo[]> {
    const query: FilterQuery<TodoDocument> = {};
    if (filter.completed !== undefined) {
      query.completed = filter.completed === 'true';
    }
    if (filter.search) {
      const regex = new RegExp(filter.search, 'i');
      query.$or = [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
      ];
    }
    return this.todoRepository.findAll(query);
  }
}
