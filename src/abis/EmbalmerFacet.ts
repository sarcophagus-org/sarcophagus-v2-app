export const EmbalmerFacetABI = [
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'archaeologists',
        type: 'address[]',
      },
    ],
    name: 'ArchaeologistListNotUnique',
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
    inputs: [],
    name: 'ArweaveArchaeologistNotInList',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ArweaveTxIdEmpty',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'signaturesLength',
        type: 'uint256',
      },
    ],
    name: 'IncorrectNumberOfArchaeologistSignatures',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint8',
        name: 'minShards',
        type: 'uint8',
      },
    ],
    name: 'MinShardsGreaterThanArchaeologists',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MinShardsZero',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newResurrectionTime',
        type: 'uint256',
      },
    ],
    name: 'NewResurrectionTimeInPast',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NoArchaeologistsProvided',
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
    name: 'SarcophagusAlreadyExists',
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
    name: 'SarcophagusAlreadyFinalized',
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
    inputs: [],
    name: 'SarcophagusIsUnwrappable',
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
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'embalmer',
        type: 'address',
      },
    ],
    name: 'SenderNotEmbalmer',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'hopefulAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'actualAddress',
        type: 'address',
      },
    ],
    name: 'SignatureFromWrongAccount',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SignatureListNotUnique',
    type: 'error',
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
    ],
    name: 'BurySarcophagus',
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
    ],
    name: 'CancelSarcophagus',
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
        internalType: 'string',
        name: 'arweaveTxId',
        type: 'string',
      },
    ],
    name: 'FinalizeSarcophagus',
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
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'canBeTransferred',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'resurrectionTime',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'embalmer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'arweaveArchaeologist',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'cursedArchaeologists',
        type: 'address[]',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalFees',
        type: 'uint256',
      },
    ],
    name: 'InitializeSarcophagus',
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
        internalType: 'uint256',
        name: 'resurrectionTime',
        type: 'uint256',
      },
    ],
    name: 'RewrapSarcophagus',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'sarcoId',
        type: 'bytes32',
      },
    ],
    name: 'burySarcophagus',
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
    ],
    name: 'cancelSarcophagus',
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
        components: [
          {
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
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
        internalType: 'struct LibTypes.SignatureWithAccount[]',
        name: 'archaeologistSignatures',
        type: 'tuple[]',
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
        name: 'arweaveArchaeologistSignature',
        type: 'tuple',
      },
      {
        internalType: 'string',
        name: 'arweaveTxId',
        type: 'string',
      },
    ],
    name: 'finalizeSarcophagus',
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
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'recipient',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'resurrectionTime',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'canBeTransferred',
            type: 'bool',
          },
          {
            internalType: 'uint8',
            name: 'minShards',
            type: 'uint8',
          },
        ],
        internalType: 'struct LibTypes.SarcophagusMemory',
        name: 'sarcophagus',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'archAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'storageFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'diggingFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'bounty',
            type: 'uint256',
          },
          {
            internalType: 'bytes32',
            name: 'hashedShard',
            type: 'bytes32',
          },
        ],
        internalType: 'struct LibTypes.ArchaeologistMemory[]',
        name: 'archaeologists',
        type: 'tuple[]',
      },
      {
        internalType: 'address',
        name: 'arweaveArchaeologist',
        type: 'address',
      },
    ],
    name: 'initializeSarcophagus',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
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
        internalType: 'uint256',
        name: 'resurrectionTime',
        type: 'uint256',
      },
    ],
    name: 'rewrapSarcophagus',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
