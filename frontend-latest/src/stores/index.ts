import { create } from 'zustand';
import { Prompt } from '@/types';

interface AppState {
  selectedPrompt: Prompt | null;
  setSelectedPrompt: (prompt: Prompt | null) => void;

  playgroundPrompt: string;
  setPlaygroundPrompt: (prompt: string) => void;

  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  selectedPrompt: null,
  setSelectedPrompt: (prompt) => set({ selectedPrompt: prompt }),

  playgroundPrompt: '',
  setPlaygroundPrompt: (prompt) => set({ playgroundPrompt: prompt }),

  isEditing: false,
  setIsEditing: (editing) => set({ isEditing: editing }),
}));
