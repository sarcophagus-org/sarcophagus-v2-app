export const ViewStateFacet = {
  abi: [
    {
      inputs: [
        {
          internalType: 'address',
          name: 'archaeologist',
          type: 'address',
        },
      ],
      name: 'getArchaeologistAccusals',
      outputs: [
        {
          internalType: 'bytes32[]',
          name: '',
          type: 'bytes32[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'archaeologist',
          type: 'address',
        },
      ],
      name: 'getArchaeologistCleanups',
      outputs: [
        {
          internalType: 'bytes32[]',
          name: '',
          type: 'bytes32[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'archaeologist',
          type: 'address',
        },
        {
          internalType: 'bytes32',
          name: 'sarcoId',
          type: 'bytes32',
        },
      ],
      name: 'getArchaeologistSuccessOnSarcophagus',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'archaeologist',
          type: 'address',
        },
      ],
      name: 'getArchaeologistsarcophagi',
      outputs: [
        {
          internalType: 'bytes32[]',
          name: '',
          type: 'bytes32[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'archaeologist',
          type: 'address',
        },
      ],
      name: 'getAvailableRewards',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'archaeologist',
          type: 'address',
        },
      ],
      name: 'getCursedBond',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'embalmer',
          type: 'address',
        },
      ],
      name: 'getEmbalmersarcophagi',
      outputs: [
        {
          internalType: 'bytes32[]',
          name: '',
          type: 'bytes32[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'archaeologist',
          type: 'address',
        },
      ],
      name: 'getFreeBond',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getProtocolFeeAmount',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'recipient',
          type: 'address',
        },
      ],
      name: 'getRecipientsarcophagi',
      outputs: [
        {
          internalType: 'bytes32[]',
          name: '',
          type: 'bytes32[]',
        },
      ],
      stateMutability: 'view',
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
      name: 'getSarcophagus',
      outputs: [
        {
          components: [
            {
              internalType: 'string',
              name: 'name',
              type: 'string',
            },
            {
              internalType: 'enum LibTypes.SarcophagusState',
              name: 'state',
              type: 'uint8',
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
              internalType: 'string[]',
              name: 'arweaveTxIds',
              type: 'string[]',
            },
            {
              internalType: 'uint256',
              name: 'storageFee',
              type: 'uint256',
            },
            {
              internalType: 'address',
              name: 'embalmer',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'recipientAddress',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'arweaveArchaeologist',
              type: 'address',
            },
            {
              internalType: 'address[]',
              name: 'archaeologists',
              type: 'address[]',
            },
          ],
          internalType: 'struct LibTypes.Sarcophagus',
          name: '',
          type: 'tuple',
        },
      ],
      stateMutability: 'view',
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
          internalType: 'address',
          name: 'archaeologist',
          type: 'address',
        },
      ],
      name: 'getSarcophagusArchaeologist',
      outputs: [
        {
          components: [
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
              name: 'doubleHashedShard',
              type: 'bytes32',
            },
            {
              internalType: 'bytes',
              name: 'unencryptedShard',
              type: 'bytes',
            },
            {
              internalType: 'uint256',
              name: 'curseTokenId',
              type: 'uint256',
            },
          ],
          internalType: 'struct LibTypes.ArchaeologistStorage',
          name: '',
          type: 'tuple',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getTotalProtocolFees',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ],
};
