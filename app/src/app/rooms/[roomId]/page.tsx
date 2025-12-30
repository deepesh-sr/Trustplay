"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { useProgram } from "@/providers/ProgramProvider";
import { useWallet } from "@jup-ag/wallet-adapter";
import { PublicKey } from "@solana/web3.js";
import { Room } from "@/types/trustplay-program";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Users, Coins, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { formatDate, formatSol, shortenAddress } from "@/lib/utils";
import { JoinRoomButton } from "@/components/JoinRoomButton";
import { DepositToVault } from "@/components/DepositToVault";
import { SubmitClaim } from "@/components/SubmitClaim";
import { VoteClaim } from "@/components/VoteClaim";
import { ResolveClaim } from "@/components/ResolveClaim";

export default function RoomDetailsPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const { programClient } = useProgram();
  const wallet = useWallet();
  
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [isParticipant, setIsParticipant] = useState(false);
  
  const roomPubkey = new PublicKey(roomId);
  
  const fetchData = async () => {
    try {
      const roomAccount = await programClient.program.account.room.fetch(roomPubkey);
      setRoom(roomAccount as any);
      
      // Fetch participants
      const participantsList = await programClient.getParticipantsByRoom(roomPubkey);
      setParticipants(participantsList);
      
      // Check if current wallet is a participant
      if (wallet.publicKey) {
        const isP = participantsList.some((p: any) => 
          p.account.player.toString() === wallet.publicKey?.toString()
        );
        setIsParticipant(isP);
      }
      
      // Fetch claims
      const claimsList = await programClient.getClaimsByRoom(roomPubkey);
      setClaims(claimsList);
    } catch (error) {
      console.error("Error fetching room data:", error);
      toast.error("Failed to load room details");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [roomPubkey, programClient, wallet.publicKey]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading room details...</div>
      </div>
    );
  }
  
  if (!room) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Room not found</div>
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link href="/rooms">
        <Button variant="ghost" className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Rooms
        </Button>
      </Link>
      
      {/* Room Header */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold">{room.name}</h1>
            <p className="text-muted-foreground mt-2">Room ID: {room.roomId}</p>
          </div>
          <Badge variant={getStatusColor(room.status)} className="text-base px-4 py-2">
            {getStatusText(room.status)}
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Room Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Room Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Room Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Coins className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Prize Pool</p>
                    <p className="text-2xl font-bold">{formatSol(room.totalPool)} SOL</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Deadline</p>
                    <p className="font-semibold">{formatDate(Number(room.deadlineTs))}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Vote Threshold</p>
                    <p className="font-semibold">{room.voteThreshold}%</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-semibold">{formatDate(Number(room.createdAt))}</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Organizer</p>
                <p className="font-mono text-sm">{shortenAddress(room.organizer.toString())}</p>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Vault Address</p>
                <p className="font-mono text-sm break-all">{room.vault.toString()}</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle>Participants ({participants.length})</CardTitle>
              <CardDescription>Players who have joined this room</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {participants.length === 0 ? (
                <p className="text-sm text-muted-foreground">No participants yet</p>
              ) : (
                participants.map((p: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="font-mono text-sm">{shortenAddress(p.account.player.toString())}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(Number(p.account.joinedAt))}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Claims Section */}
          <Card>
            <CardHeader>
              <CardTitle>Claims ({claims.length})</CardTitle>
              <CardDescription>Submitted claims for this room</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {claims.length === 0 ? (
                <p className="text-sm text-muted-foreground">No claims submitted yet</p>
              ) : (
                claims.map((c: any, idx: number) => (
                  <Card key={idx}>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{c.account.claimId}</span>
                          <Badge variant={c.account.resolved ? "default" : "secondary"}>
                            {c.account.resolved ? "Resolved" : "Pending"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-green-600">👍 {c.account.votesFor.toString()}</span>
                          <span className="text-red-600">👎 {c.account.votesAgainst.toString()}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          By: {shortenAddress(c.account.claimant.toString())}
                        </div>
                        {!c.account.resolved && wallet.publicKey && (
                          <VoteClaim
                            roomPubkey={roomPubkey}
                            claimPubkey={c.publicKey}
                            claimantPubkey={c.account.claimant}
                            onSuccess={fetchData}
                          />
                        )}
                        {!c.account.resolved && 
                         wallet.publicKey?.toString() === c.account.claimant.toString() && (
                          <ResolveClaim
                            roomPubkey={roomPubkey}
                            claimPubkey={c.publicKey}
                            vaultPubkey={room.vault}
                            onSuccess={fetchData}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Actions */}
        <div className="space-y-6">
          {/* Room Status Info */}
          <Card>
            <CardHeader>
              <CardTitle>Room Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-muted-foreground">
                  Participants can submit claims until the deadline
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-muted-foreground">
                  Claims need {room.voteThreshold}% votes to be approved
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Coins className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-muted-foreground">
                  Approved claims receive rewards from the prize pool
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {!isParticipant && wallet.publicKey && (
                <JoinRoomButton 
                  roomPubkey={roomPubkey} 
                  onSuccess={fetchData}
                />
              )}
              {isParticipant && (
                <>
                  <DepositToVault
                    roomPubkey={roomPubkey}
                    vaultPubkey={new PublicKey(room.vault)}
                    onSuccess={fetchData}
                  />
                  <SubmitClaim
                    roomPubkey={roomPubkey}
                    onSuccess={fetchData}
                  />
                </>
              )}
              {!wallet.publicKey && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Connect your wallet to interact with this room
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
