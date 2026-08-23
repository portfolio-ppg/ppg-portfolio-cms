"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

type ToastType = "success" | "error";
interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
  visible: boolean;
}

const ToastContext = createContext<((message: string, type?: ToastType) => void) | null>(null);

/** Global success/error toast — call from any client component under the admin layout. */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  function dismiss(id: number) {
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, visible: false } : t)));
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 200);
  }

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = ++idRef.current;
    setItems((prev) => [...prev, { id, type, message, visible: false }]);
    // Flip to visible on the next frame so the transition actually runs.
    requestAnimationFrame(() => {
      setItems((prev) => prev.map((t) => (t.id === id ? { ...t, visible: true } : t)));
    });
    setTimeout(() => dismiss(id), 3500);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-100 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6">
        {items.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto flex items-start gap-2.5 rounded-xl border px-4 py-3 shadow-lg transition-all duration-200 ${
              item.visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            } ${
              item.type === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {item.type === "success" ? (
              <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-green-600" />
            ) : (
              <XCircle size={17} className="mt-0.5 shrink-0 text-red-600" />
            )}
            <p className="flex-1 text-sm font-medium">{item.message}</p>
            <button
              onClick={() => dismiss(item.id)}
              className="shrink-0 opacity-60 transition-opacity hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
