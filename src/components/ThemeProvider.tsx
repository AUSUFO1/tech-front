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
    if (typeof window !== "undefined") {
      const savedTheme = window.localStorage.getItem("gizpulse-theme") as Theme | null;
      if (savedTheme) {
        return savedTheme;
      }

      if (document.documentElement.classList.contains("dark")) {
        return "dark";
      }

      return getSystemTheme();
    }

    return "light";
  });

  useEffect(() => {
    applyTheme(resolvedTheme);
    document.cookie = `gizpulse-theme=${resolvedTheme}; Path=/; Max-Age=31536000; SameSite=Lax`;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      const storedTheme = window.localStorage.getItem("gizpulse-theme") as Theme | null;
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
  }, [resolvedTheme]);

  const value = useMemo<ThemeContextValue>(() => ({
    resolvedTheme,
    setTheme: (theme: Theme) => {
      window.localStorage.setItem("gizpulse-theme", theme);
      document.cookie = `gizpulse-theme=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
      setResolvedTheme(theme);
      applyTheme(theme);
    },
  }), [resolvedTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    return {
      resolvedTheme: "light" as Theme,
      setTheme: () => {},
    };
  }

  return context;
}
