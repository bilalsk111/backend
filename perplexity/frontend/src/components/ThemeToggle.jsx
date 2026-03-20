import { Moon, Sun } from "lucide-react";
import { useTheme } from "../app/useTheme";

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center p-2 rounded-xl border border-[color:var(--border-muted)] bg-[color:var(--panel-bg)]/50 hover:bg-[color:var(--panel-bg)] transition-colors ${className}`}
      aria-label="Toggle dark/light theme"
      title="Toggle theme"
    >
      {isDark ? (
        <Sun size={18} className="text-[color:var(--text)]" />
      ) : (
        <Moon size={18} className="text-[color:var(--text)]" />
      )}
    </button>
  );
};

export default ThemeToggle;

