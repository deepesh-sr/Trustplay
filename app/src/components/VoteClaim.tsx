"use client";

import { useProgram } from "@/providers/ProgramProvider";
import { useWallet } from "@jup-ag/wallet-adapter";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SystemProgram, Transaction, PublicKey } from "@solana/web3.js";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { sendAndConfirmTransactionWithRetry, getErrorMessage } from "@/lib/transaction-utils";

interface VoteClaimProps {
  roomPubkey: PublicKey;
  claimPubkey: PublicKey;
  claimantPubkey: PublicKey;
  onSuccess?: () => void;
}

export function VoteClaim({ roomPubkey, claimPubkey, claimantPubkey, onSuccess }: VoteClaimProps) {
  const { programClient } = useProgram();
  const wallet = useWallet();
  const [loading, setLoading] = useState<'accept' | 'reject' | null>(null);

  const handleVote = async (accept: boolean) => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      toast.error("Please connect your wallet");
      return;
    }

    setLoading(accept ? 'accept' : 'reject');
    try {
      const [whitelistPda] = programClient.getWhitelistPda();
      const [voterRecordPda] = programClient.getVoterRecordPda(
        claimPubkey,
        wallet.publicKey
      );

      const ix = await programClient.program.methods
        .voteClaim(accept)
        .accounts({
          room: roomPubkey,
          claim: claimPubkey,
          voter: wallet.publicKey,
          claimant: claimantPubkey,
          whitelist: whitelistPda,
          voterRecord: voterRecordPda,
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

      console.log("Vote confirmed:", signature);
      toast.success(`Vote ${accept ? 'accepted' : 'rejected'} successfully!`);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Vote error:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-2">
      <Button 
        onClick={() => handleVote(true)} 
        disabled={loading !== null}
        variant="default"
        size="sm"
      >
        <ThumbsUp className="mr-2 h-4 w-4" />
        {loading === 'accept' ? "Voting..." : "Accept"}
      </Button>
      <Button 
        onClick={() => handleVote(false)} 
        disabled={loading !== null}
        variant="destructive"
        size="sm"
      >
        <ThumbsDown className="mr-2 h-4 w-4" />
        {loading === 'reject' ? "Voting..." : "Reject"}
      </Button>
    </div>
  );
}
