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
      ],
      name: 'getArchaeologistProfile',
      outputs: [
        {
          components: [
            {
              internalType: 'bool',
              name: 'exists',
              type: 'bool',
            },
            {
              internalType: 'string',
              name: 'peerId',
              type: 'string',
            },
            {
              internalType: 'uint256',
              name: 'minimumDiggingFee',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'maximumRewrapInterval',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'freeBond',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'cursedBond',
              type: 'uint256',
            },
          ],
          internalType: 'struct LibTypes.ArchaeologistProfile',
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
          internalType: 'uint256',
          name: 'index',
          type: 'uint256',
        },
      ],
      name: 'getArchaeologistProfileAddressAtIndex',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getArchaeologistProfileAddresses',
      outputs: [
        {
          internalType: 'address[]',
          name: '',
          type: 'address[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address[]',
          name: 'addresses',
          type: 'address[]',
        },
      ],
      name: 'getArchaeologistProfiles',
      outputs: [
        {
          components: [
            {
              internalType: 'bool',
              name: 'exists',
              type: 'bool',
            },
            {
              internalType: 'string',
              name: 'peerId',
              type: 'string',
            },
            {
              internalType: 'uint256',
              name: 'minimumDiggingFee',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'maximumRewrapInterval',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'freeBond',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'cursedBond',
              type: 'uint256',
            },
          ],
          internalType: 'struct LibTypes.ArchaeologistProfile[]',
          name: '',
          type: 'tuple[]',
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
      name: 'getArchaeologistSarcophagi',
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
          internalType: 'address[]',
          name: 'addresses',
          type: 'address[]',
        },
      ],
      name: 'getArchaeologistsStatistics',
      outputs: [
        {
          components: [
            {
              internalType: 'bytes32[]',
              name: 'successes',
              type: 'bytes32[]',
            },
            {
              internalType: 'bytes32[]',
              name: 'cancels',
              type: 'bytes32[]',
            },
            {
              internalType: 'bytes32[]',
              name: 'accusals',
              type: 'bytes32[]',
            },
          ],
          internalType: 'struct LibTypes.ArchaeologistStatistics[]',
          name: '',
          type: 'tuple[]',
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
      name: 'getEmbalmerSarcophagi',
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
      name: 'getGracePeriod',
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
      name: 'getProtocolFeeBasePercentage',
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
      name: 'getRecipientSarcophagi',
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
      name: 'getRewards',
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
              name: 'gracePeriod',
              type: 'uint256',
            },
            {
              internalType: 'string[]',
              name: 'arweaveTxIds',
              type: 'string[]',
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
              name: 'diggingFeesPaid',
              type: 'uint256',
            },
            {
              internalType: 'bytes32',
              name: 'unencryptedShardDoubleHash',
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
