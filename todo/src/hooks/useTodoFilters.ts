import { useEffect, useRef, useState } from "react";
import type { Todo } from "../types/todo";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { todoService } from "../services/todoService";

export const statusMapping: Record<string, boolean | undefined> = {
  all: undefined,
  open: false,
  done: true,
};

function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

type Filter = "all" | "open" | "done";

export function useTodoFilters() {
  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const debouncedSearch = useDebounced(search, 300);

  const status = statusMapping[filter];

  const didWarmup = useRef(false);
  useEffect(() => {
    if (didWarmup.current) return;
    didWarmup.current = true;

    const warm = async () => {
      const others: Filter[] = ["all", "open", "done"].filter((f) => f !== filter) as Filter[];
      for (const f of others) {
        const s = statusMapping[f];
        qc.prefetchQuery({
          queryKey: ["todos", "list", { search: debouncedSearch || undefined, status: s }],
          queryFn: () => todoService.getList(debouncedSearch || undefined, s),
          staleTime: 30_000,
        });
      }
    };
    void warm();
  }, [debouncedSearch, filter, qc]);

  const {
    data: todos,
    isLoading,
    isError,
    error,
    isRefetching,
    refetch,
  } = useQuery<Todo[]>({
    queryKey: ["todos", "list", { search: debouncedSearch || undefined, status }],
    queryFn: ({signal}) => todoService.getList(debouncedSearch || undefined, status, {signal}),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return {
    todos,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    search,
    setSearch,
    filter,
    setFilter,
  };
}
