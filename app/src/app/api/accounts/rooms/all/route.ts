import { NextRequest, NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import trustplayProgramIdl from "@/idl/trustplay_program.json";

const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL as string,
  "confirmed"
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const organizer = searchParams.get("organizer");

    const provider = new AnchorProvider(
      connection,
      {} as any,
      { commitment: "confirmed" }
    );

    const program = new Program(trustplayProgramIdl as any, provider);

    let rooms;
    
    if (organizer) {
      // Filter by organizer
      // @ts-ignore - IDL type mismatch
      rooms = await program.account.room.all([
        {
          memcmp: {
            offset: 8, // Discriminator
            bytes: new PublicKey(organizer).toBase58(),
          },
        },
      ]);
    } else {
      // Get all rooms
      // @ts-ignore - IDL type mismatch
      rooms = await program.account.room.all();
    }

    return NextResponse.json({ rooms });
  } catch (error: any) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}
