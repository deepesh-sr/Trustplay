"use client";

import { useProgram } from "@/providers/ProgramProvider";
import { useWallet } from "@jup-ag/wallet-adapter";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SystemProgram, Transaction, PublicKey } from "@solana/web3.js";
import { CheckCircle } from "lucide-react";
import { sendAndConfirmTransactionWithRetry, getErrorMessage } from "@/lib/transaction-utils";

interface ResolveClaimProps {
  roomPubkey: PublicKey;
  claimPubkey: PublicKey;
  vaultPubkey: PublicKey;
  onSuccess?: () => void;
}

export function ResolveClaim({ roomPubkey, claimPubkey, vaultPubkey, onSuccess }: ResolveClaimProps) {
  const { programClient } = useProgram();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);

  const handleResolve = async () => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      toast.error("Please connect your wallet");
      return;
    }

    setLoading(true);
    try {
      const [reputationPda] = programClient.getReputationPda(wallet.publicKey);

      const ix = await programClient.program.methods
        .resolveClaim()
        .accounts({
          room: roomPubkey,
          vault: vaultPubkey,
          claim: claimPubkey,
          claimant: wallet.publicKey,
          reputation: reputationPda,
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

      console.log("Claim resolved:", signature);
      toast.success("Claim resolved and rewards distributed!");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Resolve claim error:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleResolve} 
      disabled={loading}
      className="w-full"
    >
      <CheckCircle className="mr-2 h-4 w-4" />
      {loading ? "Resolving..." : "Resolve Claim"}
    </Button>
  );
}
