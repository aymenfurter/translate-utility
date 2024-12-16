export interface IChapter {
    id: string;
    title: string;
    level: number;
    markdown: string;
  }
  
  export interface ITranslatedChapter {
    id: string;
    translated_markdown: string;
  }
  
  export interface ITranslationJob {
    job_id: string;
    status: 'queued' | 'in_progress' | 'completed' | 'failed';
    target_language: string;
    chapters: IChapter[];
    translated_chapters: ITranslatedChapter[];
    completed: number;
    total: number;
  }
  
  export interface ILanguageOption {
    key: string;
    text: string;
  }
  
  export const SUPPORTED_LANGUAGES: ILanguageOption[] = [
    { key: 'fr', text: 'French' },
    { key: 'de', text: 'German' },
    { key: 'es', text: 'Spanish' },
    { key: 'it', text: 'Italian' },
    { key: 'pt', text: 'Portuguese' },
    { key: 'nl', text: 'Dutch' },
    { key: 'ru', text: 'Russian' },
    { key: 'zh', text: 'Chinese (Simplified)' },
    { key: 'ja', text: 'Japanese' },
    { key: 'ko', text: 'Korean' }
  ];