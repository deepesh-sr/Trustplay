import { NextRequest, NextResponse } from "next/server";
import { Connection, VersionedTransaction } from "@solana/web3.js";

const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL as string,
  "confirmed"
);

export async function POST(request: NextRequest) {
  try {
    const { transaction } = await request.json();

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction is required" },
        { status: 400 }
      );
    }

    // Deserialize the transaction
    const tx = VersionedTransaction.deserialize(
      Buffer.from(transaction, "base64")
    );

    // Send the transaction
    const signature = await connection.sendTransaction(tx, {
      skipPreflight: false,
      preflightCommitment: "confirmed",
    });

    // Wait for confirmation
    await connection.confirmTransaction(signature, "confirmed");

    return NextResponse.json({ signature });
  } catch (error: any) {
    console.error("Transaction error:", error);
    return NextResponse.json(
      { error: error.message || "Transaction failed" },
      { status: 500 }
    );
  }
}
