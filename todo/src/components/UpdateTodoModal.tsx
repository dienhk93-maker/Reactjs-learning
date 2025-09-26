// src/components/TodoCreateModal.tsx
import React, { useEffect, useRef, useState } from "react";
import type { CreateTodoInput, Todo } from "../types/todo";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (_id: string, payload: CreateTodoInput) => void;
  todo: Todo;
};

export default function TodoUpdateModal({
  isOpen,
  onClose,
  onUpdate,
  todo,
}: Props) {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo?.description || "");
  const [completed, setCompleted] = useState(todo.completed);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(todo?.tags || []);
  const [touched, setTouched] = useState(false);

  const firstRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Autofocus + reset when closing
  useEffect(() => {
    if (isOpen) setTimeout(() => firstRef.current?.focus(), 0);
    else {
      setTitle(todo.title);
      setDescription(todo?.description || "");
      setCompleted(todo.completed);
      setTags(todo?.tags || []);
      setTagInput("");
      setTouched(false);
    }
  }, [isOpen, todo.title, todo.description, todo.completed, todo.tags]);

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Add tag on Enter or comma
  const commitTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (!tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput("");
  };
  const onTagKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitTag();
    } else if (e.key === "Backspace" && !tagInput && tags.length) {
      // quick remove last
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const removeTag = (t: string) =>
    setTags((prev) => prev.filter((x) => x !== t));

  const invalid = !title.trim();
  const submit: React.FormEventHandler = (e) => {
    e.preventDefault();
    setTouched(true);
    if (invalid) return;
    onUpdate(todo._id, {
      title: title.trim(),
      description: description.trim() || undefined,
      tags: tags.length ? tags : undefined,
      completed,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="todo-create-title"
      onMouseDown={(e) => {
        // click outside to close
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        ref={panelRef}
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 id="todo-create-title" className="text-lg font-semibold">
            Update TODO
          </h3>
          <button
            className="rounded p-2 hover:bg-gray-100"
            onClick={onClose}
            aria-label="Close"
          >
            ✖
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              ref={firstRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Write integration tests"
              className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 ${
                touched && invalid
                  ? "border-red-400 focus:ring-red-300"
                  : "focus:ring-blue-400"
              }`}
              aria-invalid={touched && invalid}
              aria-describedby={touched && invalid ? "title-error" : undefined}
              required
            />
            {touched && invalid && (
              <p id="title-error" className="mt-1 text-sm text-red-600">
                Title is required.
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a bit more context…"
              rows={3}
              className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="mb-1 block text-sm font-medium">Tags</label>
            <div className="flex flex-wrap items-center gap-2 rounded border px-2 py-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-sm"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => removeTag(t)}
                    className="rounded p-0.5 hover:bg-gray-100"
                    aria-label={`Remove tag ${t}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={onTagKeyDown}
                onBlur={commitTag}
                placeholder={tags.length ? "" : "Type and press Enter"}
                className="flex-1 min-w-[8rem] border-0 px-2 py-1 focus:outline-none"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Press <kbd>Enter</kbd> or <kbd>,</kbd> to add a tag.
            </p>
          </div>

          {/* Completed */}
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="h-4 w-4"
            />
            <span>Completed</span>
          </label>

          {/* Actions */}
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border px-4 py-2 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={invalid}
              className={`rounded px-4 py-2 text-white ${
                invalid
                  ? "cursor-not-allowed bg-blue-300"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
