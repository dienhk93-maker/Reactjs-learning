// src/hooks/useTodoMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoService } from "../services/todoService";
import type { CreateTodoInput, Todo } from "../types/todo";

const TODOS_KEY = ["todos"] as const;

type Ctx = { prev?: Todo[] };

// -------- CREATE (optimistic) --------
export function useCreateTodo() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTodoInput) => todoService.create(payload), // must return Todo
    onMutate: async (payload): Promise<Ctx> => {
      await qc.cancelQueries({ queryKey: TODOS_KEY });
      const prev = qc.getQueryData<Todo[]>(TODOS_KEY) ?? [];

      // build safe optimistic Todo
      const optimistic: Todo = {
        _id: `temp-${Date.now()}`,
        title: payload.title,
        description: payload.description,
        tags: payload.tags,
        completed: payload.completed ?? false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      qc.setQueryData<Todo[]>(TODOS_KEY, (old = []) => [optimistic, ...old]);

      return { prev };
    },
    onError: (_err, _payload, ctx) => {
      if (ctx?.prev) qc.setQueryData(TODOS_KEY, ctx.prev);
    },
    onSuccess: (serverTodo) => {
      // replace optimistic by _id prefix
      qc.setQueryData<Todo[]>(TODOS_KEY, (old = []) =>
        old.map((t) => (t._id.startsWith("temp-") ? serverTodo : t))
      );
    },
    onSettled: () => {
      // final sync
      qc.invalidateQueries({ queryKey: TODOS_KEY });
    },
  });
}

// -------- UPDATE (optimistic) --------
export function useUpdateTodo() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (args: { _id: string; patch: Partial<Omit<Todo, "_id">> }) =>
      todoService.update(args._id, args.patch), // must return updated Todo (or nothing)
    onMutate: async ({ _id, patch }): Promise<Ctx> => {
      await qc.cancelQueries({ queryKey: TODOS_KEY });
      const prev = qc.getQueryData<Todo[]>(TODOS_KEY) ?? [];

      qc.setQueryData<Todo[]>(TODOS_KEY, (old = []) =>
        old.map((t) =>
          t._id === _id
            ? {
                ...t,
                ...patch,
                updatedAt: new Date(),
              }
            : t
        )
      );

      return { prev };
    },
    onError: (_err, _payload, ctx) => {
      if (ctx?.prev) qc.setQueryData(TODOS_KEY, ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: TODOS_KEY });
    },
  });
}

// -------- DELETE (optimistic) --------
export function useDeleteTodo() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (_id: string) => todoService.remove(_id),
    onMutate: async (_id): Promise<Ctx> => {
      await qc.cancelQueries({ queryKey: TODOS_KEY });
      const prev = qc.getQueryData<Todo[]>(TODOS_KEY) ?? [];

      qc.setQueryData<Todo[]>(TODOS_KEY, (old = []) =>
        old.filter((t) => t._id !== _id)
      );

      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(TODOS_KEY, ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: TODOS_KEY });
    },
  });
}
