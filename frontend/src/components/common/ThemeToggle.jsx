import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

export default function ThemeToggle({ className = "", showLabel = false }) {
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  const isLight = resolvedTheme === "light" || theme === "light";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={`Switch to ${isLight ? "Dark" : "Light"} Mode`}
      aria-label={`Switch to ${isLight ? "Dark" : "Light"} Mode`}
      className={`inline-flex items-center justify-center gap-2 h-9 w-9 sm:h-9 sm:w-9 rounded-xl border transition-all duration-200 cursor-pointer ${
        isLight
          ? "bg-amber-500/10 border-amber-500/30 text-amber-600 hover:bg-amber-500/20 shadow-xs"
          : "bg-slate-900 border-slate-800 text-cyan-400 hover:bg-slate-800 hover:text-cyan-300 hover:border-slate-700"
      } ${className}`}
    >
      {isLight ? (
        <Moon className="h-4 w-4 text-indigo-600 shrink-0 transition-transform duration-200 hover:-rotate-12" />
      ) : (
        <Sun className="h-4 w-4 text-amber-400 shrink-0 transition-transform duration-200 hover:rotate-90" />
      )}
      {showLabel && (
        <span className="text-xs font-bold">
          {isLight ? "Dark" : "Light"}
        </span>
      )}
    </button>
  );
}
