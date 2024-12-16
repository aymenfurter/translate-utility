import { SavedTranslation } from '../types/storage';

const STORAGE_KEY = 'translate-utility-saves';

interface SavedTranslation {
  sessionId: string;
  chapters: Array<{ id: string; title: string; content: string }>;
  translatedChapters: Array<{ id: string; content: string }>;
  selectedLanguage: string;
  timestamp: number;
}

export const saveTranslation = (data: Omit<SavedTranslation, 'timestamp'>) => {
  const saveData: SavedTranslation = {
    ...data,
    timestamp: Date.now()
  };
  localStorage.setItem('savedTranslation', JSON.stringify(saveData));
};

export const loadTranslation = (): SavedTranslation | null => {
  const saved = localStorage.getItem('savedTranslation');
  if (!saved) return null;
  
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
};

export const getSavedTranslations = (): SavedTranslation[] => {
  try {
    const saves = localStorage.getItem(STORAGE_KEY);
    return saves ? JSON.parse(saves) : [];
  } catch {
    return [];
  }
};

export const deleteSavedTranslation = (id: string) => {
  try {
    const saves = getSavedTranslations().filter(save => save.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
    return true;
  } catch {
    return false;
  }
};
