"use client";

import { useProgram } from "@/providers/ProgramProvider";
import { useWallet } from "@jup-ag/wallet-adapter";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SystemProgram, Transaction, PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { Coins } from "lucide-react";
import { sendAndConfirmTransactionWithRetry, getErrorMessage } from "@/lib/transaction-utils";

interface DepositToVaultProps {
  roomPubkey: PublicKey;
  vaultPubkey: PublicKey;
  onSuccess?: () => void;
}

export function DepositToVault({ roomPubkey, vaultPubkey, onSuccess }: DepositToVaultProps) {
  const { programClient } = useProgram();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [open, setOpen] = useState(false);

  const handleDeposit = async () => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const depositLamports = new BN(parseFloat(amount) * 1e9);

      const ix = await programClient.program.methods
        .depositToVault(depositLamports)
        .accounts({
          room: roomPubkey,
          vault: vaultPubkey,
          payer: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        } as any)
        .instruction();

      const transaction = new Transaction().add(ix);
      transaction.feePayer = wallet.publicKey;
      
      const { blockhash } = await programClient.connection.getLatestBlockhash("finalized");
      transaction.recentBlockhash = blockhash;

      const signed = await wallet.signTransaction(transaction);
      
      const signature = await sendAndConfirmTransactionWithRetry(
        programClient.connection,
        signed,
        { timeout: 90000 }
      );

      console.log("Deposit confirmed:", signature);
      toast.success(`Successfully deposited ${amount} SOL to vault!`);
      setAmount("");
      setOpen(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Deposit error:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Coins className="mr-2 h-4 w-4" />
          Deposit to Vault
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deposit SOL to Vault</DialogTitle>
          <DialogDescription>
            Deposit SOL to the room's vault. This contributes to the prize pool.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (SOL)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="1.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleDeposit} disabled={loading}>
            {loading ? "Depositing..." : "Deposit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
