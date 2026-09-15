"use client";

import {
  createContext, useContext, useState,
  useCallback, type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface PortalThemeCtx {
  theme: Theme;
  toggle: () => void;
  isDark: boolean;
}

const Ctx = createContext<PortalThemeCtx>({
  theme: "light",
  toggle: () => {},
  isDark: false,
});

export function PortalThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const toggle = useCallback(() => setTheme((t) => (t === "light" ? "dark" : "light")), []);
  const isDark = theme === "dark";

  return (
    <Ctx.Provider value={{ theme, toggle, isDark }}>
      {children}
    </Ctx.Provider>
  );
}

export const usePortalTheme = () => useContext(Ctx);
