import { useQuery } from "@tanstack/react-query";
import { todoService } from "../services/todoService";
import type { Todo } from "../types/todo";

export function useTodoDetail(id?: string) {
  return useQuery<Todo, Error>({
    queryKey: ["todo", id],
    queryFn: () => todoService.getDetail(id as string),
    enabled: !!id,
    staleTime: 60_000,
    retry: 1,
  });
}
