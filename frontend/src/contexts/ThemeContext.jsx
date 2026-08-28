import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem("aura-theme-mode") || "dark";
  });

  const [resolvedTheme, setResolvedTheme] = useState("dark");

  useEffect(() => {
    let effective = themeMode;

    if (themeMode === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      effective = prefersDark ? "dark" : "light";
    }

    setResolvedTheme(effective);
    localStorage.setItem("aura-theme-mode", themeMode);
    localStorage.setItem("aura-theme", effective);

    document.documentElement.setAttribute("data-theme", effective);
    document.documentElement.classList.remove("dark", "light", "theme-light");
    document.documentElement.classList.add(effective);

    if (effective === "light") {
      document.documentElement.classList.add("theme-light");
    }
  }, [themeMode]);

  // Listen to system preference changes if in system mode
  useEffect(() => {
    if (themeMode !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      const effective = e.matches ? "dark" : "light";
      setResolvedTheme(effective);
      document.documentElement.setAttribute("data-theme", effective);
      document.documentElement.classList.remove("dark", "light", "theme-light");
      document.documentElement.classList.add(effective);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [themeMode]);

  const setTheme = (newMode) => {
    if (["dark", "light", "system"].includes(newMode)) {
      setThemeMode(newMode);
    }
  };

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const value = useMemo(
    () => ({
      theme: themeMode,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }),
    [themeMode, resolvedTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}

export default ThemeContext;