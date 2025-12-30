import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, Users, Vote, Trophy, Coins, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center space-y-6 mb-16">
        <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold">
          🎮 Decentralized Gaming Platform
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent max-w-4xl">
          Welcome to Trustplay
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl">
          A blockchain-powered gaming platform where fairness meets transparency. 
          Create rooms, compete, submit claims, and earn rewards verified by the community.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link href="/rooms">
            <Button size="lg" className="gap-2">
              Browse Rooms
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/rooms/create">
            <Button size="lg" variant="outline" className="gap-2">
              Create Room
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <Card>
          <CardHeader>
            <Shield className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Secure & Transparent</CardTitle>
            <CardDescription>
              All transactions and claims are recorded on Solana blockchain
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Community Driven</CardTitle>
            <CardDescription>
              Participants vote on claims to ensure fair reward distribution
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Trophy className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Competitive Gaming</CardTitle>
            <CardDescription>
              Join rooms, compete with others, and prove your achievements
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Coins className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Prize Pools</CardTitle>
            <CardDescription>
              Organizers create rooms with SOL prize pools for winners
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Vote className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Democratic Voting</CardTitle>
            <CardDescription>
              Community votes on claims with configurable thresholds
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Clock className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Time-Bounded</CardTitle>
            <CardDescription>
              Rooms have deadlines to ensure timely claim submissions
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* How It Works */}
      <div className="bg-muted/50 rounded-lg p-8 md:p-12">
        <h2 className="text-3xl font-bold mb-8 text-center">How Trustplay Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
              1
            </div>
            <h3 className="font-semibold">Create or Join Room</h3>
            <p className="text-sm text-muted-foreground">
              Organizers create gaming rooms with prize pools. Players join to participate.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
              2
            </div>
            <h3 className="font-semibold">Play & Compete</h3>
            <p className="text-sm text-muted-foreground">
              Participate in the game and achieve your goals before the deadline.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
              3
            </div>
            <h3 className="font-semibold">Submit Claims</h3>
            <p className="text-sm text-muted-foreground">
              Submit your achievement claims with proof for community validation.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
              4
            </div>
            <h3 className="font-semibold">Earn Rewards</h3>
            <p className="text-sm text-muted-foreground">
              Community votes on claims. Approved claims receive rewards from the prize pool.
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/dashboard">
            <Button size="lg" variant="secondary">
              Get Started →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
