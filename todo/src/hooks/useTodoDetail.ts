import { useQuery } from "@tanstack/react-query";
import { todoService } from "../services/todoService";
import type { Todo } from "../types/todo";

export function useTodoDetail(id?: number) {
  return useQuery<Todo, Error>({
    queryKey: ["todo", id],
    queryFn: () => todoService.getDetail(id as number),
    enabled: !!id,
    staleTime: 60_000,
    retry: 1,
  });
}
