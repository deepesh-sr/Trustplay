"use client";

import { useWallet } from "@jup-ag/wallet-adapter";
import { Button } from "@/components/ui/button";
import { shortenAddress } from "@/lib/utils";
import { Wallet, LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import Image from "next/image";

export function WalletButton() {
  const wallet = useWallet();
  const [open, setOpen] = useState(false);

  const handleConnect = async (walletName: string) => {
    try {
      await wallet.select(walletName as any);
      await wallet.connect();
      setOpen(false);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  if (!wallet.publicKey) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default" className="gap-2">
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
            <DialogDescription>
              Choose a wallet to connect to Trustplay
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {wallet.wallets.map((w) => (
              <Button
                key={w.adapter.name}
                onClick={() => handleConnect(w.adapter.name)}
                variant="outline"
                className="justify-start gap-3 h-auto py-3"
              >
                {w.adapter.icon && (
                  <Image
                    src={w.adapter.icon}
                    alt={w.adapter.name}
                    width={24}
                    height={24}
                    className="rounded"
                  />
                )}
                <span className="font-semibold">{w.adapter.name}</span>
              </Button>
            ))}
            {wallet.wallets.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                <p className="mb-2">No wallets detected</p>
                <p className="text-sm">
                  Please install a Solana wallet extension like Phantom, Solflare, or Backpack
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-md bg-secondary text-secondary-foreground text-sm">
        <Wallet className="h-4 w-4" />
        {shortenAddress(wallet.publicKey.toString())}
      </div>
      <Button onClick={() => wallet.disconnect()} variant="outline" size="sm" className="gap-2">
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Disconnect</span>
      </Button>
    </div>
  );
}
