import type { CreateTodoInput, Todo } from "../types/todo";
import { buildUrl } from "../config/api.config";

export const todoService = {
  async getList(search?: string): Promise<Todo[]> {
    const params: Record<string, string> = {};
    if (search) params.q = search;
    const res = await fetch(buildUrl("/todos", params), { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch todos (${res.status})`);
    return res.json(); // đúng schema Todo
  },

  async getDetail(id: string): Promise<Todo> {
    const res = await fetch(buildUrl(`/todos/${id}`));
    if (!res.ok) throw new Error(`Failed to fetch todo detail (${res.status})`);
    return res.json();
  },

  async create(todo: CreateTodoInput): Promise<Todo> {
    const res = await fetch(buildUrl(`/todos`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo),
    });
    if (!res.ok) throw new Error(`Failed to create todo (${res.status})`);
    return res.json();
  },

  async update(id: string, patch: Partial<Omit<Todo, "id">>): Promise<Todo> {
    const res = await fetch(buildUrl(`/todos/${id}`), {
      method: "PATCH", // hoặc PUT tuỳ BE
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) throw new Error(`Failed to update todo (${res.status})`);
    return res.json();
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(buildUrl(`/todos/${id}`), { method: "DELETE" });
    if (!res.ok) throw new Error(`Failed to delete todo (${res.status})`);
  },
};
