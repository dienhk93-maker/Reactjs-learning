import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TodoResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the todo item',
    example: '64f5a8b2c1234567890abcde',
  })
  _id: string;

  @ApiProperty({
    description: 'The title of the todo item',
    example: 'Learn NestJS',
  })
  title: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the todo item',
    example: 'Complete the NestJS tutorial and build a todo application',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Tags associated with the todo item',
    example: ['work', 'learning', 'backend'],
    type: [String],
  })
  tags?: string[];

  @ApiProperty({
    description: 'Completion status of the todo item',
    example: false,
  })
  completed: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-09-25T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-09-25T10:30:00.000Z',
  })
  updatedAt: Date;
}