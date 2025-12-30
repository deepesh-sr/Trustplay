"use client";

import { useProgram } from "@/providers/ProgramProvider";
import { useWallet } from "@jup-ag/wallet-adapter";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SystemProgram, Transaction } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

interface CreateRoomFormProps {
  onSuccess?: () => void;
}

export function CreateRoomForm({ onSuccess }: CreateRoomFormProps) {
  const { programClient } = useProgram();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    roomId: "",
    name: "",
    totalPool: "",
    deadline: "",
    voteThreshold: "51",
  });

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wallet.publicKey || !wallet.signTransaction) {
      toast.error("Please connect your wallet");
      return;
    }

    setLoading(true);
    try {
      const deadlineTimestamp = Math.floor(
        new Date(formData.deadline).getTime() / 1000
      );
      const totalPoolLamports = new BN(
        parseFloat(formData.totalPool) * 1e9
      );

      const [roomPda] = programClient.getRoomPda(
        wallet.publicKey,
        formData.roomId
      );
      const [vaultPda] = programClient.getVaultPda(roomPda);

      // Build instruction with proper type casting
      const createRoomMethod = programClient.program.methods
        .createRoom(
          formData.roomId,
          formData.name,
          totalPoolLamports,
          new BN(deadlineTimestamp),
          parseInt(formData.voteThreshold)
        );

      const accountsObj = {
        room: roomPda,
        vault: vaultPda,
        organizer: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      } as any;

      const ix = await createRoomMethod.accounts(accountsObj).instruction();

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

      toast.success("Room created successfully!");
      setFormData({
        roomId: "",
        name: "",
        totalPool: "",
        deadline: "",
        voteThreshold: "51",
      });
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreateRoom} className="space-y-4 w-full max-w-md">
      <div>
        <label className="block text-sm font-medium mb-1">Room ID</label>
        <input
          type="text"
          value={formData.roomId}
          onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
          className="w-full px-3 py-2 border rounded-md bg-background"
          placeholder="my-gaming-room"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Room Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border rounded-md bg-background"
          placeholder="My Gaming Tournament"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Total Pool (SOL)
        </label>
        <input
          type="number"
          step="0.01"
          value={formData.totalPool}
          onChange={(e) =>
            setFormData({ ...formData, totalPool: e.target.value })
          }
          className="w-full px-3 py-2 border rounded-md bg-background"
          placeholder="10"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Deadline</label>
        <input
          type="datetime-local"
          value={formData.deadline}
          onChange={(e) =>
            setFormData({ ...formData, deadline: e.target.value })
          }
          className="w-full px-3 py-2 border rounded-md bg-background"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Vote Threshold (%)
        </label>
        <input
          type="number"
          min="1"
          max="100"
          value={formData.voteThreshold}
          onChange={(e) =>
            setFormData({ ...formData, voteThreshold: e.target.value })
          }
          className="w-full px-3 py-2 border rounded-md bg-background"
          required
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating..." : "Create Room"}
      </Button>
    </form>
  );
}
