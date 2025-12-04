export interface KeyLayout {
  key: string;
  display: string;
  code?: string;
  width?: number; // Multiplier for key width (default: 1)
  type?: 'normal' | 'special' | 'modifier';
}

export interface LanguageLayout {
  name: string;
  code: string;
  rows: KeyLayout[][];
}

export type SupportedLanguage = 'en' | 'hi' | 'ar' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'ru';

