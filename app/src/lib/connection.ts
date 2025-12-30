import { Connection, ConnectionConfig } from "@solana/web3.js";

/**
 * Create a Solana connection with better rate limit handling
 */
export function createConnection(): Connection {
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com";
  
  const config: ConnectionConfig = {
    commitment: "confirmed",
    // Reduce concurrent requests to avoid rate limits
    confirmTransactionInitialTimeout: 60000,
    // Add retry logic
    fetch: async (url, options) => {
      let lastError;
      const maxRetries = 3;
      const baseDelay = 1000;

      for (let i = 0; i < maxRetries; i++) {
        try {
          const response = await fetch(url, {
            ...options,
            headers: {
              ...options?.headers,
              "Content-Type": "application/json",
            },
          });

          // If rate limited (429), wait and retry with exponential backoff
          if (response.status === 429) {
            const delay = baseDelay * Math.pow(2, i);
            console.warn(`Rate limited. Retrying after ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            continue;
          }

          return response;
        } catch (error) {
          lastError = error;
          if (i < maxRetries - 1) {
            const delay = baseDelay * Math.pow(2, i);
            console.warn(`Request failed. Retrying after ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }

      throw lastError || new Error("Max retries exceeded");
    },
  };

  return new Connection(endpoint, config);
}

/**
 * Create a connection with fallback endpoints
 */
export function createConnectionWithFallback(): Connection {
  const primaryEndpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com";
  const fallbackEndpoints = process.env.NEXT_PUBLIC_FALLBACK_RPC_URLS?.split(",") || [];
  
  let currentEndpointIndex = 0;
  const allEndpoints = [primaryEndpoint, ...fallbackEndpoints];

  const config: ConnectionConfig = {
    commitment: "confirmed",
    confirmTransactionInitialTimeout: 60000,
    fetch: async (url, options) => {
      let lastError;
      
      // Try all endpoints
      for (let endpointIdx = 0; endpointIdx < allEndpoints.length; endpointIdx++) {
        const endpoint = allEndpoints[(currentEndpointIndex + endpointIdx) % allEndpoints.length];
        const actualUrl = typeof url === 'string' ? url.replace(primaryEndpoint, endpoint) : url;
        
        try {
          const response = await fetch(actualUrl, {
            ...options,
            headers: {
              ...options?.headers,
              "Content-Type": "application/json",
            },
          });

          // If rate limited, try next endpoint immediately
          if (response.status === 429) {
            console.warn(`Rate limited on ${endpoint}. Trying next endpoint...`);
            continue;
          }

          // If successful, update current endpoint
          if (response.ok) {
            currentEndpointIndex = (currentEndpointIndex + endpointIdx) % allEndpoints.length;
          }

          return response;
        } catch (error) {
          lastError = error;
          console.warn(`Request failed on ${endpoint}:`, error);
        }
      }

      throw lastError || new Error("All RPC endpoints failed");
    },
  };

  return new Connection(primaryEndpoint, config);
}

/**
 * Batch requests to reduce RPC calls
 */
export class BatchedConnection {
  private connection: Connection;
  private batchQueue: Map<string, Promise<any>> = new Map();
  private batchTimeout: NodeJS.Timeout | null = null;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  /**
   * Batch multiple getAccountInfo calls
   */
  async batchGetAccountInfo(pubkeys: string[]): Promise<any[]> {
    // Implement batching logic here if needed
    // For now, just use the connection directly
    return Promise.all(
      pubkeys.map((pk) => this.connection.getAccountInfo(pk as any))
    );
  }
}
