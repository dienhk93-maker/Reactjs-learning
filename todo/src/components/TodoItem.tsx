import React from "react";
import type { CreateTodoInput, Todo } from "../types/todo";
import { Tag } from "./Tag";
import TodoUpdateModal from "./UpdateTodoModal";

type Props = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateTodo: (_id: string, payload: CreateTodoInput) => void;
};

function timeAgo(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  const diff = Date.now() - date.getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d2 = Math.floor(h / 24);
  if (d2 < 7) return `${d2}d ago`;
  return date.toLocaleDateString();
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdateTodo,
}: Props) {
  const completed = todo.completed;
  const [isUpdateOpen, setUpdateOpen] = React.useState(false);

  const cardCls = completed
    ? "border-emerald-200 bg-emerald-50 hover:border-emerald-300"
    : "border-amber-200 bg-amber-50 hover:border-amber-300";

  const titleCls = completed
    ? "text-emerald-800 line-through"
    : "text-amber-900";

  const accentCls = completed ? "accent-emerald-600" : "accent-amber-600";

  return (
    <li
      className={`group rounded-xl border p-4 shadow-sm transition ${cardCls}`}
      aria-label={todo.title}
    >
      <div className="flex items-center gap-4">
        {/* Checkbox + title/desc */}
        <div className="flex flex-1 cursor-pointer select-none items-start gap-3" onDoubleClick={() => setUpdateOpen(true)}>
          <input
            type="checkbox"
            checked={completed}
            onChange={() => onToggle(todo._id)}
            className={`h-5 w-5 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 ${accentCls}`}
            aria-checked={completed}
            aria-label={
              completed ? "Mark as not completed" : "Mark as completed"
            }
          />
          <div className="min-w-0">
            <div className={`truncate text-base font-semibold ${titleCls}`}>
              {todo.title}
            </div>

            {todo.description ? (
              <p className="mt-1 line-clamp-2 text-sm text-slate-700">
                {todo.description}
              </p>
            ) : null}

            {todo.tags?.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {todo.tags.map((t) => (
                  <Tag key={t} label={t} />
                ))}
              </div>
            ) : null}

            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <span
                title={`Created: ${new Date(todo.createdAt).toLocaleString()}`}
              >
                Created {timeAgo(todo.createdAt)}
              </span>
              <span aria-hidden>•</span>
              <span
                title={`Updated: ${new Date(todo.updatedAt).toLocaleString()}`}
              >
                Updated {timeAgo(todo.updatedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 gap-1">
          <button
            onClick={() => setUpdateOpen(true)}
            className="rounded-md p-2 text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
            title="Edit"
            aria-label={`Edit "${todo.title}"`}
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(todo._id)}
            className="rounded-md p-2 text-rose-600 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-300"
            title="Delete"
            aria-label={`Delete "${todo.title}"`}
          >
            🗑️
          </button>
        </div>
      </div>

      <TodoUpdateModal
        isOpen={isUpdateOpen}
        onClose={() => setUpdateOpen(false)}
        onUpdate={onUpdateTodo}
        todo={todo}
      />
    </li>
  );
}
