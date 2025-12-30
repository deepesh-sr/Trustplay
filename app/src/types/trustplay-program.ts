/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/trustplay_program.json`.
 */
export type TrustplayProgram = {
  "address": "5iKkxpwybyU7ReYKvwwzMtqw5zP9VFTe52KhvXuQSNAe",
  "metadata": {
    "name": "trustplayProgram",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addToWhitelist",
      "docs": [
        "Add an address to the whitelist"
      ],
      "discriminator": [
        157,
        211,
        52,
        54,
        144,
        81,
        5,
        55
      ],
      "accounts": [
        {
          "name": "oraganizer",
          "writable": true,
          "signer": true
        },
        {
          "name": "whitelist",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  104,
                  105,
                  116,
                  101,
                  108,
                  105,
                  115,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "address",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "createRoom",
      "docs": [
        "Create a new gaming room with prize pool"
      ],
      "discriminator": [
        130,
        166,
        32,
        2,
        247,
        120,
        178,
        53
      ],
      "accounts": [
        {
          "name": "room",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  111,
                  111,
                  109
                ]
              },
              {
                "kind": "account",
                "path": "organizer"
              },
              {
                "kind": "arg",
                "path": "roomId"
              }
            ]
          }
        },
        {
          "name": "organizer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "roomId",
          "type": "string"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "totalPool",
          "type": "u64"
        },
        {
          "name": "deadline",
          "type": "i64"
        },
        {
          "name": "voteThreshold",
          "type": "u8"
        }
      ]
    },
    {
      "name": "depositToVault",
      "docs": [
        "Deposit SOL to the room's vault"
      ],
      "discriminator": [
        18,
        62,
        110,
        8,
        26,
        106,
        248,
        151
      ],
      "accounts": [
        {
          "name": "room",
          "writable": true
        },
        {
          "name": "vault",
          "docs": [
            "vault PDA is the destination - must be initialized already"
          ],
          "writable": true
        },
        {
          "name": "payer",
          "docs": [
            "payer (must sign)"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeWhitelist",
      "docs": [
        "Initialize the whitelist account"
      ],
      "discriminator": [
        223,
        228,
        11,
        219,
        112,
        174,
        108,
        18
      ],
      "accounts": [
        {
          "name": "organizer",
          "writable": true,
          "signer": true
        },
        {
          "name": "whitelist",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  104,
                  105,
                  116,
                  101,
                  108,
                  105,
                  115,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "joinRoom",
      "docs": [
        "Join an existing room as a participant"
      ],
      "discriminator": [
        95,
        232,
        188,
        81,
        124,
        130,
        78,
        139
      ],
      "accounts": [
        {
          "name": "room",
          "writable": true
        },
        {
          "name": "participant",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  114,
                  116,
                  105,
                  99,
                  105,
                  112,
                  97,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "room"
              },
              {
                "kind": "account",
                "path": "player"
              }
            ]
          }
        },
        {
          "name": "player",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "removeFromWhitelist",
      "docs": [
        "Remove an address from the whitelist"
      ],
      "discriminator": [
        7,
        144,
        216,
        239,
        243,
        236,
        193,
        235
      ],
      "accounts": [
        {
          "name": "oraganizer",
          "writable": true,
          "signer": true
        },
        {
          "name": "whitelist",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  104,
                  105,
                  116,
                  101,
                  108,
                  105,
                  115,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "address",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "resolveClaim",
      "docs": [
        "Resolve a claim and distribute rewards if approved"
      ],
      "discriminator": [
        63,
        99,
        216,
        44,
        183,
        52,
        190,
        140
      ],
      "accounts": [
        {
          "name": "room",
          "writable": true
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "claim",
          "writable": true
        },
        {
          "name": "claimant",
          "docs": [
            "claimant to receive fund"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "reputation",
          "docs": [
            "reputation PDA for claimant (init if needed)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  112
                ]
              },
              {
                "kind": "account",
                "path": "claimant"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "submitClaim",
      "docs": [
        "Submit a claim for achievements in a room"
      ],
      "discriminator": [
        163,
        108,
        111,
        46,
        220,
        82,
        77,
        212
      ],
      "accounts": [
        {
          "name": "room",
          "writable": true
        },
        {
          "name": "claim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "account",
                "path": "room"
              },
              {
                "kind": "account",
                "path": "claimant"
              },
              {
                "kind": "arg",
                "path": "claimId"
              }
            ]
          }
        },
        {
          "name": "claimant",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "claimId",
          "type": "string"
        }
      ]
    },
    {
      "name": "voteClaim",
      "docs": [
        "Vote on a claim (accept or reject)"
      ],
      "discriminator": [
        119,
        71,
        176,
        255,
        239,
        225,
        251,
        107
      ],
      "accounts": [
        {
          "name": "room",
          "writable": true
        },
        {
          "name": "claim",
          "writable": true
        },
        {
          "name": "voter",
          "docs": [
            "Voter signer"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "claimant",
          "writable": true
        },
        {
          "name": "whitelist",
          "docs": [
            "whitelist"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  104,
                  105,
                  116,
                  101,
                  108,
                  105,
                  115,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "voterRecord",
          "docs": [
            "a voter_record to prevent double votes"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  111,
                  116,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "claim"
              },
              {
                "kind": "account",
                "path": "voter"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "accept",
          "type": "bool"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "claim",
      "discriminator": [
        155,
        70,
        22,
        176,
        123,
        215,
        246,
        102
      ]
    },
    {
      "name": "participant",
      "discriminator": [
        32,
        142,
        108,
        79,
        247,
        179,
        54,
        6
      ]
    },
    {
      "name": "reputation",
      "discriminator": [
        55,
        148,
        90,
        71,
        68,
        183,
        193,
        28
      ]
    },
    {
      "name": "room",
      "discriminator": [
        156,
        199,
        67,
        27,
        222,
        23,
        185,
        94
      ]
    },
    {
      "name": "voterRecord",
      "discriminator": [
        178,
        96,
        138,
        116,
        143,
        202,
        115,
        33
      ]
    },
    {
      "name": "whitelist",
      "discriminator": [
        204,
        176,
        52,
        79,
        146,
        121,
        54,
        247
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "numericalOverflow",
      "msg": "Number overflow"
    },
    {
      "code": 6001,
      "name": "alreadyResolved",
      "msg": "Already Resolved"
    },
    {
      "code": 6002,
      "name": "noVotes",
      "msg": "No Votes"
    },
    {
      "code": 6003,
      "name": "noParticipants",
      "msg": "No Participant"
    },
    {
      "code": 6004,
      "name": "insufficientFunds",
      "msg": "Insufficient Funds"
    },
    {
      "code": 6005,
      "name": "voterNotWhitelisted",
      "msg": "Voter is not whitelisted"
    },
    {
      "code": 6006,
      "name": "invalidVaultAccount",
      "msg": "Invalid vault account"
    }
  ],
  "types": [
    {
      "name": "claim",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "claimant",
            "type": "pubkey"
          },
          {
            "name": "claimId",
            "type": "string"
          },
          {
            "name": "votesFor",
            "type": "u64"
          },
          {
            "name": "votesAgainst",
            "type": "u64"
          },
          {
            "name": "resolved",
            "type": "bool"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "resolvedAt",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "participant",
      "docs": [
        "Participant account"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "player",
            "type": "pubkey"
          },
          {
            "name": "joinedAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "reputation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "player",
            "type": "pubkey"
          },
          {
            "name": "score",
            "type": "u64"
          },
          {
            "name": "wins",
            "type": "u32"
          },
          {
            "name": "initialized",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "room",
      "docs": [
        "Room account"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "organizer",
            "type": "pubkey"
          },
          {
            "name": "roomId",
            "type": "string"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "totalPool",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "roomStatus"
              }
            }
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "deadlineTs",
            "type": "i64"
          },
          {
            "name": "voteThreshold",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "roomStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "open"
          },
          {
            "name": "inProgress"
          },
          {
            "name": "resolved"
          },
          {
            "name": "cancelled"
          }
        ]
      }
    },
    {
      "name": "voterRecord",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "claim",
            "type": "pubkey"
          },
          {
            "name": "voter",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "whitelist",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "addresses",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "seed",
      "type": "string",
      "value": "\"anchor\""
    }
  ]
};

// Export proper types for use in components
import { PublicKey } from "@solana/web3.js";

export interface Room {
  organizer: PublicKey;
  roomId: string;
  name: string;
  vault: PublicKey;
  totalPool: bigint;
  status: RoomStatus;
  createdAt: bigint;
  deadlineTs: bigint;
  voteThreshold: number;
  bump: number;
}

export interface Claim {
  claimant: PublicKey;
  claimId: string;
  votesFor: bigint;
  votesAgainst: bigint;
  resolved: boolean;
  createdAt: bigint;
  resolvedAt: bigint | null;
  bump: number;
}

export interface Participant {
  player: PublicKey;
  joinedAt: bigint;
  bump: number;
}

export interface Reputation {
  player: PublicKey;
  score: bigint;
  wins: number;
  initialized: boolean;
  bump: number;
}

export type RoomStatus = 
  | { open: {} }
  | { inProgress: {} }
  | { resolved: {} }
  | { cancelled: {} };

export interface VoterRecord {
  claim: PublicKey;
  voter: PublicKey;
  bump: number;
}

export interface Whitelist {
  addresses: PublicKey[];
  bump: number;
}

