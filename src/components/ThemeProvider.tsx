"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  resolvedTheme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function ThemeProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [resolvedTheme, setResolvedTheme] = useState<Theme>(() => {
    if (typeof document !== "undefined" && document.documentElement.classList.contains("dark")) {
      return "dark";
    }

    return "light";
  });

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("techfront-theme") as Theme | null;
    const initialTheme = savedTheme ?? getSystemTheme();

    setResolvedTheme(initialTheme);
    applyTheme(initialTheme);
    document.cookie = `techfront-theme=${initialTheme}; Path=/; Max-Age=31536000; SameSite=Lax`;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      const storedTheme = window.localStorage.getItem("techfront-theme") as Theme | null;
      if (storedTheme) {
        return;
      }

      const nextTheme = mediaQuery.matches ? "dark" : "light";
      setResolvedTheme(nextTheme);
      applyTheme(nextTheme);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const value = useMemo<ThemeContextValue>(() => ({
    resolvedTheme,
    setTheme: (theme: Theme) => {
      window.localStorage.setItem("techfront-theme", theme);
      document.cookie = `techfront-theme=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
      setResolvedTheme(theme);
      applyTheme(theme);
    },
  }), [resolvedTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
