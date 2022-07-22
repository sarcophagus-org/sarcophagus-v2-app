export const ArchaeologistFacetABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'archaeologist',
        type: 'address',
      },
    ],
    name: 'ArchaeologistAlreadyUnwrapped',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'archaeologist',
        type: 'address',
      },
    ],
    name: 'ArchaeologistNotOnSarcophagus',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'cursedBond',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'NotEnoughCursedBond',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'freeBond',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'NotEnoughFreeBond',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'reward',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'NotEnoughReward',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'resurrectionTime',
        type: 'uint256',
      },
    ],
    name: 'ResurrectionTimeInPast',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'sarcoId',
        type: 'bytes32',
      },
    ],
    name: 'SarcophagusDoesNotExist',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'sarcoId',
        type: 'bytes32',
      },
    ],
    name: 'SarcophagusNotFinalized',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'sarcoId',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'signer',
        type: 'address',
      },
    ],
    name: 'SignerNotArchaeologistOnSarcophagus',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'resurrectionTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'currentTime',
        type: 'uint256',
      },
    ],
    name: 'TooEarlyToUnwrap',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'resurrectionTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'resurrectionWindow',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'currentTime',
        type: 'uint256',
      },
    ],
    name: 'TooLateToUnwrap',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'unencryptedShard',
        type: 'bytes',
      },
      {
        internalType: 'bytes32',
        name: 'hashedShard',
        type: 'bytes32',
      },
    ],
    name: 'UnencryptedShardHashMismatch',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'archaeologist',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'depositedBond',
        type: 'uint256',
      },
    ],
    name: 'DepositFreeBond',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'sarcoId',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'arweaveTxId',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'oldArchaeologist',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newArchaeologist',
        type: 'address',
      },
    ],
    name: 'FinalizeTransfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'sarcoId',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'unencryptedShard',
        type: 'bytes',
      },
    ],
    name: 'UnwrapSarcophagus',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'archaeologist',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'withdrawnBond',
        type: 'uint256',
      },
    ],
    name: 'WithdrawFreeBond',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'archaeologist',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'withdrawnReward',
        type: 'uint256',
      },
    ],
    name: 'WithdrawReward',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'depositFreeBond',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'sarcoId',
        type: 'bytes32',
      },
      {
        internalType: 'string',
        name: 'arweaveTxId',
        type: 'string',
      },
      {
        components: [
          {
            internalType: 'uint8',
            name: 'v',
            type: 'uint8',
          },
          {
            internalType: 'bytes32',
            name: 'r',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 's',
            type: 'bytes32',
          },
        ],
        internalType: 'struct LibTypes.Signature',
        name: 'oldArchSignature',
        type: 'tuple',
      },
    ],
    name: 'finalizeTransfer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'sarcoId',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: 'unencryptedShard',
        type: 'bytes',
      },
    ],
    name: 'unwrapSarcophagus',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'withdrawFreeBond',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'withdrawReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
