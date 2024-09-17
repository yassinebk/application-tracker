// app/providers.js
"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export const NextAuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return <SessionProvider>{children}</SessionProvider>;
};

