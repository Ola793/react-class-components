import { useTheme } from '../hooks/useTheme';

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const icon = theme === 'dark' ? '☀️' : '🌙';

  return (
    <button
      className="theme-switcher"
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme`}
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  );
}