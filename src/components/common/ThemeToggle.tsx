import React, { useState, useEffect } from 'react';
import { themeStore, ThemeMode } from '../../services/themeStore';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>(themeStore.getTheme());

  useEffect(() => {
    const update = () => setTheme(themeStore.getTheme());
    return themeStore.subscribe(update);
  }, []);

  return (
    <button
      onClick={() => themeStore.toggleTheme()}
      aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
      className="p-2 rounded-full bg-[#FDFBF7]/80 dark:bg-[#1A1715]/80 border border-[#EBE4D8] dark:border-[#2C2724] text-[#2C221E] dark:text-slate-200 hover:text-[#C86D44] dark:hover:text-amber-400 backdrop-blur-md shadow-sm transition-all duration-200 cursor-pointer"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700" />
      )}
    </button>
  );
};
