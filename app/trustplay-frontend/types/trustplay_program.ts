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
      "name": "createRoom",
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
          "name": "vault",
          "docs": [
            "We create it here as a system account (create_account)."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "room"
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
    }
  ],
  "accounts": [
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
    }
  ],
  "types": [
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
