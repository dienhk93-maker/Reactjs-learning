import type { CreateTodoInput, Todo } from "../types/todo";
import { buildUrl } from "../config/api.config";

export const todoService = {
  /**
   * Get list of todos
   * @param search optional search keyword
   * @param completed filter by completed state (true|false) or leave undefined for all
   */
  async getList(
    search?: string,
    completed?: boolean | null,
    opts: { signal?: AbortSignal } = {}
  ): Promise<Todo[]> {
    const queryParams: Record<string, string | boolean> = {};
    if (search && search.trim()) queryParams.search = search.trim();
    if (completed !== null && completed !== undefined)
      queryParams.completed = completed;
    const res = await fetch(buildUrl("/todos", queryParams), {
      cache: "no-store",
      signal: opts.signal,
    });
    if (!res.ok) throw new Error(`Failed to fetch todos (${res.status})`);
    return res.json();
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

  async delete(id: string): Promise<void> {
    const res = await fetch(buildUrl(`/todos/${id}`), { method: "DELETE" });
    if (!res.ok) throw new Error(`Failed to delete todo (${res.status})`);
  },

  async count(
    params: { search?: string; completed?: boolean } = {},
    opts: { signal?: AbortSignal } = {}
  ): Promise<{ total: number; done: number; open: number }> {
    const { search, completed } = params;
    const qp: Record<string, string> = {};
    if (search && search.trim()) qp.search = search.trim();
    if (typeof completed === "boolean") qp.completed = String(completed);

    const url = buildUrl("/todos/count/status", qp);

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal: opts.signal,
      });

      if (!res.ok) {
        let detail = "";
        try {
          detail = await res.text();
        } catch {}
        throw new Error(
          `Failed to fetch todo counts: ${res.status} ${res.statusText}${
            detail ? ` - ${detail}` : ""
          }`
        );
      }

      const data = (await res.json()) as unknown;

      if (
        !data ||
        typeof data !== "object" ||
        typeof (data as any).total !== "number" ||
        typeof (data as any).done !== "number" ||
        typeof (data as any).open !== "number"
      ) {
        throw new Error("Invalid response shape for todo counts");
      }

      const { total, done, open } = data as {
        total: number;
        done: number;
        open: number;
      };
      return { total, done, open };
    } catch (error) {
      throw new Error(
        `Failed to fetch todo counts: ${(error as Error).message}`
      );
    }
  },
};
