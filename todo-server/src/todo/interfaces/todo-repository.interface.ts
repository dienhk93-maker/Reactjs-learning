import { BaseRepository } from '../../common/interfaces/base-repository.interface';
import { TodoDocument } from '../schemas/todo.schema';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';

export interface ITodoRepository extends BaseRepository<TodoDocument> {
  /**
   * Create a new todo
   * @param createTodoDto - Todo creation data
   * @returns Promise of the created todo
   */
  create(createTodoDto: CreateTodoDto): Promise<TodoDocument>;

  /**
   * Update a todo by ID
   * @param id - Todo ID
   * @param updateTodoDto - Todo update data
   * @returns Promise of the updated todo or null if not found
   */
  update(id: string, updateTodoDto: UpdateTodoDto): Promise<TodoDocument | null>;

  /**
   * Find todos by completion status
   * @param completed - Completion status
   * @returns Promise of array of todos
   */
  findByStatus(completed: boolean): Promise<TodoDocument[]>;

  /**
   * Find todos by tags
   * @param tags - Array of tags to search for
   * @returns Promise of array of todos
   */
  findByTags(tags: string[]): Promise<TodoDocument[]>;

  /**
   * Find todos containing text in title or description
   * @param searchText - Text to search for
   * @returns Promise of array of todos
   */
  search(searchText: string): Promise<TodoDocument[]>;

  /**
   * Find todos created within date range
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Promise of array of todos
   */
  findByDateRange(startDate: Date, endDate: Date): Promise<TodoDocument[]>;
}