import { Connection, Transaction, SendOptions, Commitment } from "@solana/web3.js";

/**
 * Send and confirm transaction with better error handling and timeout management
 */
export async function sendAndConfirmTransactionWithRetry(
  connection: Connection,
  transaction: Transaction,
  options: {
    maxRetries?: number;
    commitment?: Commitment;
    timeout?: number;
  } = {}
): Promise<string> {
  const {
    maxRetries = 3,
    commitment = "confirmed",
    timeout = 60000, // 60 seconds
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const signature = await connection.sendRawTransaction(
        transaction.serialize(),
        {
          skipPreflight: false,
          maxRetries: 2,
        }
      );

      // Wait for confirmation with timeout
      const confirmationPromise = connection.confirmTransaction(
        signature,
        commitment
      );

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Transaction confirmation timeout")), timeout)
      );

      await Promise.race([confirmationPromise, timeoutPromise]);

      return signature;
    } catch (error: any) {
      lastError = error;
      console.warn(`Transaction attempt ${attempt + 1} failed:`, error.message);

      if (attempt < maxRetries - 1) {
        // Wait before retry with exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("Transaction failed after all retries");
}

/**
 * Check if error is due to rate limiting
 */
export function isRateLimitError(error: any): boolean {
  const message = error?.message || error?.toString() || "";
  return (
    message.includes("429") ||
    message.includes("Too Many Requests") ||
    message.includes("rate limit")
  );
}

/**
 * Check if error is due to timeout
 */
export function isTimeoutError(error: any): boolean {
  const message = error?.message || error?.toString() || "";
  return (
    message.includes("timeout") ||
    message.includes("timed out") ||
    message.includes("Transaction confirmation timeout")
  );
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: any): string {
  if (isRateLimitError(error)) {
    return "Network is busy. Please try again in a moment.";
  }

  if (isTimeoutError(error)) {
    return "Transaction is taking longer than expected. It may still succeed. Check your wallet shortly.";
  }

  // Extract Solana program errors
  if (error?.logs) {
    const errorLog = error.logs.find((log: string) => 
      log.includes("Error:") || log.includes("failed:")
    );
    if (errorLog) {
      return errorLog;
    }
  }

  // Extract anchor errors
  if (error?.error?.errorMessage) {
    return error.error.errorMessage;
  }

  return error?.message || "Transaction failed. Please try again.";
}
