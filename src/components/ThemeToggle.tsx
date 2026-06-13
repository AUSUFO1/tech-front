"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { useTheme } from "@/components/ThemeProvider";

function subscribe() {
  return () => {};
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  if (!mounted) {
    return <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-11 w-11 items-center justify-center rounded-full text-inherit transition-colors hover:bg-black/5 dark:hover:bg-white/8"
    >
      {isDark ? (
        <Sun className="h-5 w-5" strokeWidth={1.8} />
      ) : (
        <Moon className="h-5 w-5" strokeWidth={1.8} />
      )}
    </button>
  );
}
