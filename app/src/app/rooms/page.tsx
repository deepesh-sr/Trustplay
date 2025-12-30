"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RoomList } from "@/components/RoomList";
import { CreateRoomForm } from "@/components/CreateRoomForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function RoomsPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed">("all");

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold">Gaming Rooms</h1>
            <p className="text-muted-foreground mt-2">
              Browse and join available gaming rooms or create your own
            </p>
          </div>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Create Room
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create a New Gaming Room</DialogTitle>
                <DialogDescription>
                  Set up your room with a prize pool and invite players to compete
                </DialogDescription>
              </DialogHeader>
              <CreateRoomForm onSuccess={() => setShowCreateDialog(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filter:</span>
          <div className="flex gap-2">
            <Badge
              variant={filterStatus === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilterStatus("all")}
            >
              All Rooms
            </Badge>
            <Badge
              variant={filterStatus === "active" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilterStatus("active")}
            >
              Active
            </Badge>
            <Badge
              variant={filterStatus === "completed" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilterStatus("completed")}
            >
              Completed
            </Badge>
          </div>
        </div>
      </div>

      {/* Room List */}
      <RoomList filter={filterStatus} />
    </div>
  );
}
