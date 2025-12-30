"use client";

import { TrustplayProgramClient } from "@/lib/trustplay-program-client";
import { useConnection } from "@jup-ag/wallet-adapter";
import { createContext, ReactNode, useContext, useMemo } from "react";

interface ProgramContextType {
  programClient: TrustplayProgramClient;
}

const ProgramContext = createContext<ProgramContextType>(
  {} as ProgramContextType
);

export function useProgram() {
  return useContext(ProgramContext);
}

export function ProgramProvider({ children }: { children: ReactNode }) {
  const { connection } = useConnection();

  const programClient = useMemo(
    () => new TrustplayProgramClient(connection),
    [connection]
  );

  return (
    <ProgramContext.Provider
      value={{
        programClient,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
}
