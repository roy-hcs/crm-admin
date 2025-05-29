import {create} from 'zustand';
import i18n from '../i18n/i18n';

interface StoreState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  language: string;
  setLanguage: (lang: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  isDarkMode: false,  // Default to light mode 
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  language: i18n.language || 'en',
  setLanguage: (lang: string) => {
    i18n.changeLanguage(lang);
    set({ language: lang });
  }
}));