import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTodoDto {
  @ApiProperty({
    description: 'The title of the todo item',
    example: 'Learn NestJS',
    minLength: 1,
    maxLength: 100,
  })
  title: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the todo item',
    example: 'Complete the NestJS tutorial and build a todo application',
    maxLength: 500,
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Tags associated with the todo item',
    example: ['work', 'learning', 'backend'],
    type: [String],
  })
  tags?: string[];
}