export const ThirdPartyFacet = {
  abi: [
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
      inputs: [],
      name: 'NotEnoughProof',
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
      inputs: [],
      name: 'SarcophagusNotCleanable',
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
        {
          indexed: true,
          internalType: 'address',
          name: 'accuser',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'accuserBondReward',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'embalmerBondReward',
          type: 'uint256',
        },
      ],
      name: 'AccuseArchaeologist',
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
          indexed: true,
          internalType: 'address',
          name: 'cleaner',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'cleanerBondReward',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'embalmerBondReward',
          type: 'uint256',
        },
      ],
      name: 'CleanUpSarcophagus',
      type: 'event',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'sarcoId',
          type: 'bytes32',
        },
        {
          internalType: 'bytes32[]',
          name: 'unencryptedShardHashes',
          type: 'bytes32[]',
        },
        {
          internalType: 'address',
          name: 'paymentAddress',
          type: 'address',
        },
      ],
      name: 'accuse',
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
          internalType: 'address',
          name: 'paymentAddress',
          type: 'address',
        },
      ],
      name: 'clean',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
};
