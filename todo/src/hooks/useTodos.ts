// useTodos.ts
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { todoService } from "../services/todoService";
import type { Todo } from "../types/todo";

type TodosQuery = {
  limit?: number;
  page?: number;
  search?: string;
};

export function useTodos(params: TodosQuery = { limit: 10 }) {
  const { limit = 10, page, search } = params;

  return useQuery<Todo[], Error>({
    queryKey: ["todos", { limit, page, search }],
    queryFn: () => todoService.getList(search),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    select: (data) => [...data].sort((a, b) => a.title.localeCompare(b.title)),
  });
}
