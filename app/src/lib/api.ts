import { VersionedTransaction } from "@solana/web3.js";
import { v0TxToBase64 } from "./utils";

// Wrapped fetch function for API calls
export async function wrappedFetch(
  url: string,
  method: string = "GET",
  body: any = null
): Promise<any> {
  const res = await fetch(url, {
    method,
    body: body ? JSON.stringify(body) : null,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "API request failed");
  }

  return data;
}

// Send transaction through API
export async function sendTx(tx: VersionedTransaction): Promise<string> {
  const data = await wrappedFetch("/api/transaction/send", "POST", {
    transaction: v0TxToBase64(tx),
  });

  return data.signature;
}
