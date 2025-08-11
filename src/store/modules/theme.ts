import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * Global theme store: single source of truth for dark mode
 * - Persists to localStorage('darkMode')
 * - Applies/removes the `dark` class on <html>
 */
export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false);

  const applyHtmlClass = (v: boolean) => {
    const root = document.documentElement;
    if (v) root.classList.add('dark');
    else root.classList.remove('dark');
  };

  const setDark = (v: boolean) => {
    isDark.value = v;
    applyHtmlClass(v);
    try {
      localStorage.setItem('darkMode', String(v));
    } catch {
      console.error('Failed to set dark mode');
    }
  };

  const toggle = () => setDark(!isDark.value);

  const init = () => {
    try {
      const persisted = localStorage.getItem('darkMode') === 'true';
      setDark(persisted);
    } catch {
      setDark(false);
    }
  };

  return { isDark, setDark, toggle, init };
});
