import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { todoService } from "../services/todoService";
import type { Todo } from "../types/todo";

type TodosQuery = {
  completed?: boolean;
  search?: string;
};

export function useTodos(params: TodosQuery = {}) {
  const { completed, search } = params;

  return useQuery<Todo[], Error>({
    queryKey: ["todos", { completed, search }],
    queryFn: () => todoService.getList(search, completed),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    select: (data) => [...data].sort((a, b) => a.title.localeCompare(b.title)),
  });
}
