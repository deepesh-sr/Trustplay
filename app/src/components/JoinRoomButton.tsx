"use client";

import { useProgram } from "@/providers/ProgramProvider";
import { useWallet } from "@jup-ag/wallet-adapter";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SystemProgram, Transaction, PublicKey } from "@solana/web3.js";
import { Users } from "lucide-react";
import { sendAndConfirmTransactionWithRetry, getErrorMessage } from "@/lib/transaction-utils";

interface JoinRoomButtonProps {
  roomPubkey: PublicKey;
  onSuccess?: () => void;
  disabled?: boolean;
}

export function JoinRoomButton({ roomPubkey, onSuccess, disabled }: JoinRoomButtonProps) {
  const { programClient } = useProgram();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);

  const handleJoinRoom = async () => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      toast.error("Please connect your wallet");
      return;
    }

    setLoading(true);
    try {
      const [participantPda] = programClient.getParticipantPda(
        roomPubkey,
        wallet.publicKey
      );

      const ix = await programClient.program.methods
        .joinRoom()
        .accounts({
          room: roomPubkey,
          participant: participantPda,
          player: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        } as any)
        .instruction();

      const transaction = new Transaction().add(ix);
      transaction.feePayer = wallet.publicKey;
      
      const { blockhash, lastValidBlockHeight } = 
        await programClient.connection.getLatestBlockhash("finalized");
      transaction.recentBlockhash = blockhash;

      const signed = await wallet.signTransaction(transaction);
      
      // Use improved transaction sending with retry logic
      const signature = await sendAndConfirmTransactionWithRetry(
        programClient.connection,
        signed,
        { timeout: 90000 } // 90 second timeout
      );

      console.log("Transaction confirmed:", signature);
      toast.success("Successfully joined the room!");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Join room error:", error);
      const errorMsg = getErrorMessage(error);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleJoinRoom} 
      disabled={loading || disabled}
      className="w-full"
    >
      <Users className="mr-2 h-4 w-4" />
      {loading ? "Joining..." : "Join Room"}
    </Button>
  );
}
