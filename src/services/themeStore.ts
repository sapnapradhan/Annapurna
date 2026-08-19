export type ThemeMode = 'light' | 'dark';

class ThemeStore {
  private theme: ThemeMode = 'dark'; // Default dark/moody editorial
  private listeners: Set<() => void> = new Set();

  constructor() {
    const saved = localStorage.getItem('annapurna_theme_v1') as ThemeMode;
    if (saved === 'light' || saved === 'dark') {
      this.theme = saved;
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.theme = prefersDark ? 'dark' : 'light';
    }
    this.applyTheme();
  }

  private applyTheme() {
    if (this.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }

  public getTheme(): ThemeMode {
    return this.theme;
  }

  public toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('annapurna_theme_v1', this.theme);
    this.applyTheme();
    this.notify();
  }

  public setTheme(mode: ThemeMode) {
    this.theme = mode;
    localStorage.setItem('annapurna_theme_v1', mode);
    this.applyTheme();
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }
}

export const themeStore = new ThemeStore();
