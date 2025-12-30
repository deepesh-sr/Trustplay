"use client";

import { useRouter } from "next/navigation";
import { CreateRoomForm } from "@/components/CreateRoomForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreateRoomPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/rooms");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/rooms">
        <Button variant="ghost" className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Rooms
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Create a New Gaming Room</CardTitle>
          <CardDescription>
            Set up your gaming room with a prize pool, invite players, and manage the competition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateRoomForm onSuccess={handleSuccess} />
        </CardContent>
      </Card>

      <div className="mt-8 p-6 bg-muted/50 rounded-lg">
        <h3 className="font-semibold mb-3">Room Creation Guidelines</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Choose a unique Room ID that players can easily remember</li>
          <li>• Set a clear and descriptive name for your room</li>
          <li>• The total pool is the prize amount in SOL (minimum 0.1 SOL)</li>
          <li>• Deadline determines when claims can no longer be submitted</li>
          <li>• Vote threshold is the minimum number of votes required to approve a claim</li>
          <li>• All transactions are recorded on Solana blockchain</li>
        </ul>
      </div>
    </div>
  );
}
