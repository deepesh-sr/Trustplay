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
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    const provider = new AnchorProvider(
      connection,
      {} as any,
      { commitment: "confirmed" }
    );

    const program = new Program(trustplayProgramIdl as any, provider);

    // @ts-ignore - IDL type mismatch
    const roomData = await program.account.room.fetch(new PublicKey(address));

    return NextResponse.json({ data: roomData });
  } catch (error: any) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch room" },
      { status: 500 }
    );
  }
}
