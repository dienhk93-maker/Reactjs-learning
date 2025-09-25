// src/components/TodoPage.tsx
import React from 'react';
import { useTodos } from '../hooks/useTodos';
import { useTodoFilters } from '../hooks/useTodoFilters';
import { useCreateTodo, useDeleteTodo, useUpdateTodo } from '../hooks/useTodoMutations';
import TodoItem from './TodoItem';
import type { CreateTodoInput, Todo } from '../types/todo';
import TodoCreateModal from './CreateTodoModal';

function TodoSkeleton() {
  return (
    <li className="animate-pulse rounded-lg border bg-white p-4 shadow-sm" aria-hidden>
      <div className="flex items-center justify-between gap-4">
        <div className="flex w-full items-center gap-2">
          <div className="h-4 w-4 rounded bg-gray-200" />
          <div className="h-4 flex-1 rounded bg-gray-200" />
        </div>
        <div className="h-6 w-6 rounded bg-gray-200" />
      </div>
      <div className="mt-2 h-3 w-24 rounded bg-gray-200" />
    </li>
  );
}

export default function TodoPage() {
  const { data = [], isLoading, isError, error, refetch, isRefetching } = useTodos({ limit: 20 });
  const { filtered, counts, search, setSearch, filter, setFilter } = useTodoFilters(data);

  const createTodo = useCreateTodo();
  const deleteTodo = useDeleteTodo();
  const updateTodo = useUpdateTodo();

  const [isCreateOpen, setCreateOpen] = React.useState(false);
  const searchRef = React.useRef<HTMLInputElement>(null);

  // Keyboard shortcuts: "/" focus search, "n" open create
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if ((e.key === 'n' || e.key === 'N') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        setCreateOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Type fixes: id is string in your interface
  const handleCreate = (payload: CreateTodoInput) => {
    createTodo.mutate(payload);
  };
  const handleDelete = (id: string) => deleteTodo.mutate(id);
  const handleToggle = (id: string, completed: boolean) => updateTodo.mutate({ id, patch: { completed } });

  const isBusy =
    createTodo.isPending || deleteTodo.isPending || updateTodo.isPending || isRefetching;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-sky-50 to-slate-100">
      <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center p-6">
        <div className="w-full rounded-2xl border bg-white/95 shadow-2xl backdrop-blur h-full">
          {/* Toolbar */}
          <div className="sticky top-0 z-10 rounded-t-2xl border-b bg-white/95 px-6 py-4 backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">📝 TODO List</h1>
                <span className="hidden rounded-full border px-2 py-0.5 text-xs text-slate-600 sm:inline">
                  {counts.total} items
                </span>
                {isBusy && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-600" />
                    syncing…
                  </span>
                )}
              </div>

              <div className="flex w-full gap-2 sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search title… ( / )"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-10 w-full rounded-md border pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    aria-label="Search todos by title"
                  />
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
                </div>
                <button
                  onClick={() => setCreateOpen(true)}
                  className="h-10 rounded-md bg-indigo-600 px-4 text-white hover:bg-indigo-700"
                >
                  + Create
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-3 flex items-center gap-2 text-sm">
              <button
                onClick={() => setFilter('all')}
                className={`rounded-full border px-3 py-1 transition ${
                  filter === 'all' ? 'border-slate-800 bg-slate-800 text-white' : 'bg-white text-slate-700'
                }`}
              >
                ALL <span className="ml-1 rounded-full bg-black/10 px-2">{counts.total}</span>
              </button>

              <button
                onClick={() => setFilter('open')}
                className={`rounded-full border px-3 py-1 transition ${
                  filter === 'open'
                    ? 'border-amber-500 bg-amber-500 text-white'
                    : 'border-amber-300 bg-white text-amber-700'
                }`}
              >
                OPEN{' '}
                <span className="ml-1 rounded-full bg-amber-100 px-2 text-amber-800">{counts.open}</span>
              </button>

              <button
                onClick={() => setFilter('done')}
                className={`rounded-full border px-3 py-1 transition ${
                  filter === 'done'
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-emerald-300 bg-white text-emerald-700'
                }`}
              >
                DONE{' '}
                <span className="ml-1 rounded-full bg-emerald-100 px-2 text-emerald-800">{counts.done}</span>
              </button>

              <button
                onClick={() => refetch()}
                className="ml-auto rounded-md border px-3 py-1 text-slate-700 hover:bg-slate-100"
                title="Refresh list"
                disabled={isRefetching}
              >
                ↻ Refresh
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              {isLoading && (
                <ul className="grid gap-3" role="status" aria-live="polite" aria-busy="true">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <TodoSkeleton key={i} />
                  ))}
                </ul>
              )}

              {isError && !isLoading && (
                <div className="rounded-lg border bg-red-50 p-4 text-red-700">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate">
                      <strong>Error:</strong> {error?.message ?? 'Unknown error'}
                    </p>
                    <button
                      onClick={() => refetch()}
                      className="shrink-0 rounded-md bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}

              {!isLoading && !isError && (
                <>
                  {filtered.length === 0 ? (
                    <div className="rounded-lg border bg-white p-10 text-center text-slate-500">
                      <div className="mb-2 text-4xl">🗒️</div>
                      <p className="mb-4">No todos found.</p>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setCreateOpen(true)}
                          className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                        >
                          Create your first todo
                        </button>
                        {search && (
                          <button
                            onClick={() => setSearch('')}
                            className="rounded-md border px-4 py-2 hover:bg-gray-50"
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <ul
                      className="grid max-h-[65vh] gap-3 overflow-y-auto pr-2"
                      role="list"
                      aria-label="Todo items"
                    >
                      {filtered.map((todo) => (
                        <TodoItem
                          key={todo.id}
                          todo={todo}
                          onToggle={(id) => handleToggle(id, !todo.completed)}
                          onDelete={handleDelete}
                        />
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <TodoCreateModal
        isOpen={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
