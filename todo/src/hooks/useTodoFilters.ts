import { useEffect, useMemo, useState } from "react";
import type { Todo } from "../types/todo";

export type FilterTab = "all" | "open" | "done";

function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export function useTodoFilters(todos: Todo[]) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");
  const debouncedSearch = useDebounced(search, 300);

  const counts = useMemo(() => {
    const done = todos.filter((t) => t.completed).length;
    const open = todos.length - done;
    return { total: todos.length, done, open };
  }, [todos]);

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    let base = todos;
    if (filter === "open") base = base.filter((t) => !t.completed);
    if (filter === "done") base = base.filter((t) => t.completed);
    if (!q) return base;
    return base.filter((t) => t.title.toLowerCase().includes(q));
  }, [todos, filter, debouncedSearch]);

  return { search, setSearch, filter, setFilter, counts, filtered };
}
