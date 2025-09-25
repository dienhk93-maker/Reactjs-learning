import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TodoRepository } from './repositories/todo.repository';
import { Todo, TodoSchema } from './schemas/todo.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }])],
  controllers: [TodoController],
  providers: [TodoService, TodoRepository],
  exports: [TodoService, TodoRepository],
})
export class TodoModule {}