"use client";

import { useProgram } from "@/providers/ProgramProvider";
import { useWallet } from "@jup-ag/wallet-adapter";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { FileText } from "lucide-react";

interface SubmitClaimProps {
  roomPubkey: PublicKey;
  onSuccess?: () => void;
}

export function SubmitClaim({ roomPubkey, onSuccess }: SubmitClaimProps) {
  const { programClient } = useProgram();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [claimId, setClaimId] = useState("");

  const handleSubmit = async () => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!claimId) {
      toast.error("Please enter a claim ID");
      return;
    }

    setLoading(true);
    try {
      const [claimPda] = programClient.getClaimPda(
        roomPubkey,
        wallet.publicKey,
        claimId
      );

      const ix = await programClient.program.methods
        .submitClaim(claimId)
        .accounts({
          room: roomPubkey,
          claim: claimPda,
          claimant: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        } as any)
        .instruction();

      const transaction = new Transaction().add(ix);
      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = (
        await programClient.connection.getLatestBlockhash()
      ).blockhash;

      const signed = await wallet.signTransaction(transaction);
      const signature = await programClient.connection.sendRawTransaction(
        signed.serialize()
      );

      await programClient.connection.confirmTransaction(signature, "confirmed");

      toast.success("Claim submitted successfully!");
      setClaimId("");
      setOpen(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to submit claim");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <FileText className="mr-2 h-4 w-4" />
          Submit Claim
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit a Claim</DialogTitle>
          <DialogDescription>
            Submit a claim ID to track your achievement in this room. Whitelisted voters will vote on your claim.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="claimId">Claim ID</Label>
            <Input
              id="claimId"
              placeholder="my-achievement-1"
              value={claimId}
              onChange={(e) => setClaimId(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              A unique identifier for your claim (e.g., "game-win-1", "tournament-champion")
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit Claim"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
