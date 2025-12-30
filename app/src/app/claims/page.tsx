"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle, ArrowRight, Award, CheckCircle } from "lucide-react";

export default function ClaimsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">My Claims</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your submitted claims
          </p>
        </div>

        {/* Coming Soon Message */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <CardTitle>Claims Feature Coming Soon</CardTitle>
            </div>
            <CardDescription>
              The claims submission and voting system will be available once the program instructions are fully implemented
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Planned Features:</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg border">
                  <Award className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Submit Claims</h4>
                    <p className="text-sm text-muted-foreground">
                      Submit achievement claims for rooms you've joined with proof of your accomplishments
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg border">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Vote on Claims</h4>
                    <p className="text-sm text-muted-foreground">
                      Vote to approve or reject claims submitted by other participants
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg border">
                  <AlertCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Track Claim Status</h4>
                    <p className="text-sm text-muted-foreground">
                      Monitor the voting progress and final resolution of your claims
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="font-semibold mb-3">How Claims Work:</h3>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>Participants submit claims with proof of their achievements before the room deadline</li>
                <li>Community members vote on the validity of each claim</li>
                <li>Claims that meet the vote threshold are approved and marked for rewards</li>
                <li>Approved claims receive their share of the prize pool from the vault</li>
              </ol>
            </div>

            <div className="flex gap-4">
              <Link href="/rooms">
                <Button className="gap-2">
                  Browse Rooms
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Example Claims UI (Placeholder) */}
        <Card>
          <CardHeader>
            <CardTitle>Claims List (Preview)</CardTitle>
            <CardDescription>
              This is how your claims will appear once the feature is implemented
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { id: 1, room: "Epic Tournament #1", status: "pending", votes: "2/3" },
                { id: 2, room: "Speed Challenge", status: "approved", votes: "5/3" },
                { id: 3, room: "Ultimate Quest", status: "rejected", votes: "1/3" },
              ].map((claim) => (
                <div key={claim.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex-1">
                    <h4 className="font-semibold">{claim.room}</h4>
                    <p className="text-sm text-muted-foreground">Claim #{claim.id}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">Votes: {claim.votes}</p>
                    </div>
                    <Badge 
                      variant={
                        claim.status === "approved" 
                          ? "success" 
                          : claim.status === "rejected" 
                          ? "destructive" 
                          : "default"
                      }
                    >
                      {claim.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
