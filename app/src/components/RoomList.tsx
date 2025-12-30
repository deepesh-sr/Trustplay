"use client";

import { useProgram } from "@/providers/ProgramProvider";
import { useEffect, useState } from "react";
import { Room } from "@/types/trustplay-program";
import { PublicKey } from "@solana/web3.js";
import { formatDate, formatSol } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Calendar, Coins, ArrowRight } from "lucide-react";

interface RoomListProps {
  filter?: "all" | "active" | "completed";
}

export function RoomList({ filter = "all" }: RoomListProps) {
  const { programClient } = useProgram();
  const [rooms, setRooms] = useState<
    Array<{ publicKey: PublicKey; account: Room }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const fetchedRooms = await programClient.getAllRooms();
        setRooms(fetchedRooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [programClient]);

  // Filter rooms based on filter prop
  const filteredRooms = rooms.filter((room) => {
    if (filter === "all") return true;
    if (filter === "active") {
      return "open" in room.account.status || "inProgress" in room.account.status;
    }
    if (filter === "completed") {
      return "resolved" in room.account.status || "cancelled" in room.account.status;
    }
    return true;
  });

  if (loading) {
    return <div className="text-center py-8">Loading rooms...</div>;
  }

  if (filteredRooms.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No rooms found. Create one to get started!
      </div>
    );
  }

  const getStatusColor = (status: any) => {
    if ("open" in status) return "success";
    if ("inProgress" in status) return "info";
    if ("resolved" in status) return "default";
    if ("cancelled" in status) return "destructive";
    return "default";
  };

  const getStatusText = (status: any) => {
    if ("open" in status) return "Open";
    if ("inProgress" in status) return "In Progress";
    if ("resolved" in status) return "Resolved";
    if ("cancelled" in status) return "Cancelled";
    return "Unknown";
  };

  return (
    <div className="w-full space-y-4">
      {filteredRooms.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No {filter !== "all" ? filter : ""} rooms found.
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map(({ publicKey, account }) => (
          <Card key={publicKey.toString()} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant={getStatusColor(account.status)}>
                  {getStatusText(account.status)}
                </Badge>
              </div>
              <CardTitle className="text-xl">{account.name}</CardTitle>
              <CardDescription>Room ID: {account.roomId}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Coins className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">{formatSol(account.totalPool)} SOL</span>
                <span className="text-muted-foreground">Prize Pool</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Deadline: {formatDate(Number(account.deadlineTs))}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Vote Threshold: {account.voteThreshold}%</span>
              </div>
              
              <Link href={`/rooms/${publicKey.toString()}`}>
                <Button className="w-full gap-2" variant="outline">
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
