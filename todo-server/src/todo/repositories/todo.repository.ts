import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Todo, TodoDocument } from '../schemas/todo.schema';
import { ITodoRepository } from '../interfaces/todo-repository.interface';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';

@Injectable()
export class TodoRepository implements ITodoRepository {
  constructor(
    @InjectModel(Todo.name) private readonly todoModel: Model<TodoDocument>,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<TodoDocument> {
    const createdTodo = new this.todoModel(createTodoDto);
    return createdTodo.save();
  }

  async findAll(filter?: FilterQuery<TodoDocument>): Promise<TodoDocument[]> {
    return this.todoModel.find(filter || {}).exec();
  }

  async findById(id: string): Promise<TodoDocument | null> {
    return this.todoModel.findById(id).exec();
  }

  async findOne(filter: FilterQuery<TodoDocument>): Promise<TodoDocument | null> {
    return this.todoModel.findOne(filter).exec();
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<TodoDocument | null> {
    return this.todoModel
      .findByIdAndUpdate(id, updateTodoDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<TodoDocument | null> {
    return this.todoModel.findByIdAndDelete(id).exec();
  }

  async exists(id: string): Promise<boolean> {
    const doc = await this.todoModel.findById(id).select('_id').exec();
    return !!doc;
  }

  async findByStatus(completed: boolean): Promise<TodoDocument[]> {
    return this.todoModel.find({ completed }).exec();
  }

  async findByTags(tags: string[]): Promise<TodoDocument[]> {
    return this.todoModel.find({ tags: { $in: tags } }).exec();
  }

  async search(searchText: string): Promise<TodoDocument[]> {
    const regex = new RegExp(searchText, 'i'); // Case-insensitive search
    return this.todoModel
      .find({
        $or: [
          { title: { $regex: regex } },
          { description: { $regex: regex } },
        ],
      })
      .exec();
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<TodoDocument[]> {
    return this.todoModel
      .find({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .exec();
  }

  async countByStatus(search?: string) : Promise<{total: number, done: number, open: number}> {
    let query: Record<string, any> = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
      ];
    }
    const pipeline = [
      { $match: {
        ...query
      } },
      {
        $facet: {
          total: [{ $count: 'count' }],
          done: [{ $match: { completed: true } }, { $count: 'count' }],
          open: [{ $match: { completed: false } }, { $count: 'count' }],
        },
      },
    ];
    const result = await this.todoModel.aggregate(pipeline).exec();
    return {
      total: result[0]?.total[0]?.count || 0,
      done: result[0]?.done[0]?.count || 0,
      open: result[0]?.open[0]?.count || 0,
    };
  }
}