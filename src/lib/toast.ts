"use client";

/**
 * Lightweight toast store — drop-in replacement for sonner's `toast` API.
 * Supports: toast.success(msg), toast.error(msg), toast(msg), toast.loading(msg)
 * Rendered by <AppToaster /> in the root layout.
 */

export type ToastType = "success" | "error" | "info" | "warning" | "loading";

export interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
  duration: number;
}

type Listener = (toasts: ToastItem[]) => void;

let nextId = 1;
let toasts: ToastItem[] = [];
const listeners = new Set<Listener>();
const timers = new Map<number, ReturnType<typeof setTimeout>>();

function emit() {
  for (const l of listeners) l(toasts);
}

function subscribe(l: Listener): () => void {
  listeners.add(l);
  l(toasts);
  return () => listeners.delete(l);
}

function dismiss(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  const timer = timers.get(id);
  if (timer) {
    clearTimeout(timer);
    timers.delete(id);
  }
  emit();
}

function push(type: ToastType, message: string, duration = 4000): number {
  const id = nextId++;
  toasts = [...toasts, { id, type, message, duration }];
  emit();
  if (duration > 0) {
    const timer = setTimeout(() => dismiss(id), duration);
    timers.set(id, timer);
  }
  return id;
}

export const toast = Object.assign(
  (message: string, opts?: { duration?: number }) =>
    push("info", message, opts?.duration),
  {
    success: (message: string, opts?: { duration?: number }) =>
      push("success", message, opts?.duration),
    error: (message: string, opts?: { duration?: number }) =>
      push("error", message, opts?.duration ?? 6000),
    info: (message: string, opts?: { duration?: number }) =>
      push("info", message, opts?.duration),
    warning: (message: string, opts?: { duration?: number }) =>
      push("warning", message, opts?.duration),
    loading: (message: string) => push("loading", message, 0),
    dismiss: (id: number) => dismiss(id),
  }
);

export { subscribe, dismiss };
