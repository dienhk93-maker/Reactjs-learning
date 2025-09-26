// src/hooks/useCountTodo.ts
import { keepPreviousData, QueryClient, useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { todoService } from "../services/todoService";

export const todoKeys = {
  all: () => ["todos"] as const,
  count: (p: { completed?: boolean; search?: string } = {}) => ["todos", "count", p] as const,
  list: (p: { search?: string; status?: boolean } = {}) => ["todos", "list", p] as const,
};

type CountParams = { completed?: boolean; search?: string };
type CountData = { total: number; done: number; open: number };

function normalizeCountParams(params?: CountParams): CountParams {
  const completed =
    typeof params?.completed === "boolean" ? params!.completed : undefined;
  const search =
    params?.search && params.search.trim() ? params.search.trim() : undefined;
  return { ...(completed !== undefined ? { completed } : {}), ...(search ? { search } : {}) };
}

type ExtraOpts = Pick<
  UseQueryOptions<CountData, Error, CountData>,
  "enabled" | "staleTime" | "gcTime" | "refetchOnMount" | "refetchOnWindowFocus" | "retry" | "select"
>;

export function useCountTodo(
  params?: CountParams,
  opts?: ExtraOpts
) {
  const p = normalizeCountParams(params);

  return useQuery<CountData, Error>({
    queryKey: todoKeys.count(p),
    queryFn: ({signal}) => todoService.count(p, {signal}),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
    ...opts,
  });
}

export async function prefetchCount(qc: QueryClient, params?: CountParams) {
  const p = normalizeCountParams(params);
  await qc.prefetchQuery({
    queryKey: todoKeys.count(p),
    queryFn: () => todoService.count(p),
    staleTime: 60_000,
  });
}
