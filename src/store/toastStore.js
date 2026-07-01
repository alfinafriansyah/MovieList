import { create } from 'zustand';

let idCounter = 0;

export const useToastStore = create((set, get) => ({
  toasts: [],

  push(message, type = 'success') {
    const id = ++idCounter;
    set({ toasts: [...get().toasts, { id, message, type }] });
    setTimeout(() => get().dismiss(id), 4000);
  },

  success(message) {
    get().push(message, 'success');
  },

  error(message) {
    get().push(message, 'error');
  },

  dismiss(id) {
    set({ toasts: get().toasts.filter((t) => t.id !== id) });
  },
}));
