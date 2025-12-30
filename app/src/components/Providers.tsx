"use client";

import { wrappedFetch } from "@/lib/api";
import { ReactNode } from "react";
import { SWRConfig } from "swr";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SolanaProvider } from "@/providers/SolanaProvider";
import { ProgramProvider } from "@/providers/ProgramProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        suspense: false,
        revalidateOnFocus: false,
        fetcher: wrappedFetch,
      }}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SolanaProvider>
          <ProgramProvider>{children}</ProgramProvider>
        </SolanaProvider>
      </ThemeProvider>
    </SWRConfig>
  );
}
