"use client";

import {
  UnifiedWalletProvider,
  ConnectionProvider,
} from "@jup-ag/wallet-adapter";
import { ReactNode } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { toast } from "sonner";

const CLUSTER = process.env.NEXT_PUBLIC_SOLANA_CLUSTER || "devnet";

const metadata = {
  name: "Trustplay",
  description: "Decentralized gaming platform with claim-based reward distribution",
  url: process.env.NEXT_PUBLIC_FRONTEND_BASE_URL as string,
  iconUrls: [`${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/favicon.ico`],
};

export function SolanaProvider({ children }: { children: ReactNode }) {
  const endpoint =
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? clusterApiUrl(CLUSTER as any);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <UnifiedWalletProvider
        wallets={[]}
        config={{
          autoConnect: true,
          env: CLUSTER as any,
          metadata,
          notificationCallback: {
            onConnect: (props) => {
              toast.success(`Connected to wallet ${props.shortAddress}`);
            },
            onConnecting: (props) => {
              toast.message(`Connecting to ${props.walletName}`);
            },
            onDisconnect: (props) => {
              toast.message(`Disconnected from wallet ${props.shortAddress}`);
            },
            onNotInstalled: (props) => {
              toast.error(`${props.walletName} Wallet is not installed.`);
            },
          },
          theme: "jupiter",
        }}
      >
        {children}
      </UnifiedWalletProvider>
    </ConnectionProvider>
  );
}
