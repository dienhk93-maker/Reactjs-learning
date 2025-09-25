export interface Todo {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  tags?: string[];
  completed?: boolean;
}