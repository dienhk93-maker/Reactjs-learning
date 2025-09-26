import { useEffect, useRef, useState } from "react";
import { todoKeys } from "./useCountTodo";
import type { Todo } from "../types/todo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoService } from "../services/todoService";


export function useTodoDelete() {
  const qc = useQueryClient();
  const listKey = todoKeys.list();
  const [pending, setPending] = useState<null | { item: Todo; timeoutId: number | null }>(null);
  const prevListRef = useRef<Todo[] | null>(null);
  const WINDOW_MS = 5000;

  const deleteTodo = useMutation({
    mutationFn: (id: string) => todoService.delete(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: listKey });
      const prev = qc.getQueryData<Todo[]>(listKey) ?? [];
      prevListRef.current = prev;
  
      const item = prev.find(t => t._id === id)!;
      qc.setQueryData<Todo[]>(listKey, prev.filter(t => t._id !== id));
  
      const timeoutId = window.setTimeout(() => setPending(null), WINDOW_MS);
      setPending({ item, timeoutId });
  
      return { prev };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(listKey, ctx.prev);
      if (pending?.timeoutId) clearTimeout(pending.timeoutId);
      setPending(null);
      prevListRef.current = null;
    },
    onSettled: () => qc.invalidateQueries({ queryKey: todoKeys.count() }),
  });
  
  const undo = () => {
    if (!pending) return;
    if (pending.timeoutId) clearTimeout(pending.timeoutId);
    if (prevListRef.current) qc.setQueryData(listKey, prevListRef.current);
    qc.invalidateQueries({ queryKey: listKey });
    setPending(null);
    prevListRef.current = null;
  };

  useEffect(() => () => { if (pending?.timeoutId) clearTimeout(pending.timeoutId); }, [pending]);

  return { deleteTodo, pending, undo };
}



