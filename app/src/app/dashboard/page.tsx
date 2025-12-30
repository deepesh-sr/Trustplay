"use client";

import { useEffect, useState } from "react";
import { useProgram } from "@/providers/ProgramProvider";
import { useWallet } from "@jup-ag/wallet-adapter";
import { PublicKey } from "@solana/web3.js";
import { Room } from "@/types/trustplay-program";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Wallet, TrendingUp, Award, Calendar, Coins, ArrowRight } from "lucide-react";
import { formatDate, formatSol } from "@/lib/utils";

export default function DashboardPage() {
  const { programClient } = useProgram();
  const wallet = useWallet();
  
  const [allRooms, setAllRooms] = useState<Array<{ publicKey: PublicKey; account: Room }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rooms = await programClient.getAllRooms();
        setAllRooms(rooms);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (wallet.publicKey) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [programClient, wallet.publicKey]);

  // Filter rooms where user is the organizer
  const myRooms = allRooms.filter((r) => 
    r.account.organizer.toString() === (wallet.publicKey?.toString() || "")
  );

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

  if (!wallet.publicKey) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Please connect your wallet to view your dashboard
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your rooms and track your gaming activity
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  My Rooms
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{myRooms.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Rooms you created
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Rooms
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{allRooms.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Available on platform
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Prize Pool
                </CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatSol(
                  myRooms.reduce((sum, r) => sum + Number(r.account.totalPool), 0)
                )} SOL
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                From your rooms
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Rooms
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {myRooms.filter(r => "open" in r.account.status || "inProgress" in r.account.status).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Currently running
              </p>
            </CardContent>
          </Card>
        </div>

        {/* My Rooms Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">My Rooms</h2>
            <Link href="/rooms/create">
              <Button className="gap-2">
                Create New Room
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {myRooms.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Rooms Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first gaming room to get started
                </p>
                <Link href="/rooms/create">
                  <Button>Create Room</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myRooms.map(({ publicKey, account }) => (
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
                    
                    <Link href={`/rooms/${publicKey.toString()}`}>
                      <Button className="w-full gap-2" variant="outline">
                        Manage Room
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Coming Soon Section */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Features Coming Soon</CardTitle>
            <CardDescription>
              These features will be available once all program instructions are implemented
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-lg border">
                <Award className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold">My Participations</h4>
                  <p className="text-sm text-muted-foreground">
                    View rooms you've joined as a participant
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg border">
                <TrendingUp className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold">My Claims</h4>
                  <p className="text-sm text-muted-foreground">
                    Track your submitted claims and their status
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg border">
                <Calendar className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold">Voting History</h4>
                  <p className="text-sm text-muted-foreground">
                    See your voting activity on claims
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
