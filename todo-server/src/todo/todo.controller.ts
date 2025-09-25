import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoResponseDto } from './dto/todo-response.dto';

@ApiTags('todos')
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new todo item' })
  @ApiBody({ type: CreateTodoDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The todo has been successfully created.',
    type: TodoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all todo items or filter by completion status' })
  @ApiQuery({
    name: 'completed',
    required: false,
    description: 'Filter todos by completion status',
    enum: ['true', 'false'],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of todos retrieved successfully.',
    type: [TodoResponseDto],
  })
  findAll(@Query('completed') completed?: string) {
    if (completed !== undefined) {
      const isCompleted = completed === 'true';
      return this.todoService.findByStatus(isCompleted);
    }
    return this.todoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific todo item by ID' })
  @ApiParam({
    name: 'id',
    description: 'Id of the todo item',
    example: '64f5a8b2c1234567890abcde',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Todo item retrieved successfully.',
    type: TodoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Todo item not found.',
  })
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific todo item' })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the todo item',
    example: '64f5a8b2c1234567890abcde',
  })
  @ApiBody({ type: UpdateTodoDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Todo item updated successfully.',
    type: TodoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Todo item not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(id, updateTodoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific todo item' })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the todo item',
    example: '64f5a8b2c1234567890abcde',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Todo item deleted successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Todo item not found.',
  })
  remove(@Param('id') id: string) {
    return this.todoService.remove(id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search todos by text in title or description' })
  @ApiQuery({
    name: 'q',
    description: 'Search query text',
    required: true,
    example: 'NestJS',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Search results retrieved successfully.',
    type: [TodoResponseDto],
  })
  search(@Query('q') searchText: string) {
    return this.todoService.search(searchText);
  }

  @Get('tags/:tags')
  @ApiOperation({ summary: 'Find todos by tags' })
  @ApiParam({
    name: 'tags',
    description: 'Comma-separated list of tags',
    example: 'work,urgent',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Todos with specified tags retrieved successfully.',
    type: [TodoResponseDto],
  })
  findByTags(@Param('tags') tags: string) {
    const tagArray = tags.split(',').map(tag => tag.trim());
    return this.todoService.findByTags(tagArray);
  }

  @Get('exists/:id')
  @ApiOperation({ summary: 'Check if a todo exists' })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the todo item',
    example: '64f5a8b2c1234567890abcde',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Existence check completed successfully.',
    schema: {
      type: 'object',
      properties: {
        exists: { type: 'boolean', example: true },
      },
    },
  })
  async checkExists(@Param('id') id: string) {
    const exists = await this.todoService.exists(id);
    return { exists };
  }
}