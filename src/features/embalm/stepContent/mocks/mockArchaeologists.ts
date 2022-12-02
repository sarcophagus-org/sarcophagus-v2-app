import { Archaeologist } from '../../../../types/index';
import { BigNumber } from 'ethers';

export function mochArchaeologists(): Archaeologist[] {
  return [
    {
      profile: {
        archAddress: '0x51EfafFE68e654180Bc85e9C83bf46c83a5987e7',
        exists: true,
        minimumDiggingFee: BigNumber.from('3000000000000000000'),
        maximumRewrapInterval: BigNumber.from('3'),
        successes: BigNumber.from('3'),
        cleanups: BigNumber.from('3'),
        accusals: BigNumber.from('3'),
        failures: BigNumber.from('3'),
        peerId: '001',
      },
      isOnline: true,
    },
    {
      profile: {
        archAddress: '0x8536696b151a9df992ba1fabb9311ed34d11291b',
        exists: true,
        minimumDiggingFee: BigNumber.from('4000000000000000000'),
        maximumRewrapInterval: BigNumber.from('4'),
        successes: BigNumber.from('4'),
        cleanups: BigNumber.from('4'),
        accusals: BigNumber.from('4'),
        failures: BigNumber.from('4'),
        peerId: '002',
      },
      isOnline: true,
    },
    {
      profile: {
        archAddress: '0x5838b6246d303b64be81bee3a363bbce70c2c841',
        exists: true,
        minimumDiggingFee: BigNumber.from('1000000000000000000'),
        maximumRewrapInterval: BigNumber.from('1'),
        successes: BigNumber.from('1'),
        cleanups: BigNumber.from('1'),
        accusals: BigNumber.from('1'),
        failures: BigNumber.from('1'),
        peerId: '003',
      },
      isOnline: true,
    },
    {
      profile: {
        archAddress: '0x11680e55b13b38fe90b9e83ab53323775482c286',
        exists: true,
        minimumDiggingFee: BigNumber.from('2000000000000000000'),
        maximumRewrapInterval: BigNumber.from('2'),
        successes: BigNumber.from('2'),
        cleanups: BigNumber.from('2'),
        accusals: BigNumber.from('2'),
        failures: BigNumber.from('2'),
        peerId: '004',
      },
      isOnline: true,
    },
    {
      profile: {
        archAddress: '0x2dc74f999d0d4f7bb10e032ac710480a2f90e0d8',
        exists: true,
        minimumDiggingFee: BigNumber.from('5000000000000000000'),
        maximumRewrapInterval: BigNumber.from('5'),
        successes: BigNumber.from('5'),
        cleanups: BigNumber.from('5'),
        accusals: BigNumber.from('5'),
        failures: BigNumber.from('5'),
        peerId: '005',
      },
      isOnline: true,
    },
    {
      profile: {
        archAddress: '0x31a7476b7824114f9584467fdc8b13bfbe8e987c',
        exists: true,
        minimumDiggingFee: BigNumber.from('6000000000000000000'),
        maximumRewrapInterval: BigNumber.from('6'),
        successes: BigNumber.from('6'),
        cleanups: BigNumber.from('6'),
        accusals: BigNumber.from('6'),
        failures: BigNumber.from('6'),
        peerId: '006',
      },
      isOnline: true,
    },
    {
      profile: {
        archAddress: '0x0000000000000000000000000000000000000001',
        exists: true,
        minimumDiggingFee: BigNumber.from('7000000000000000000'),
        maximumRewrapInterval: BigNumber.from('7'),
        successes: BigNumber.from('7'),
        cleanups: BigNumber.from('7'),
        accusals: BigNumber.from('7'),
        failures: BigNumber.from('7'),
        peerId: '007',
      },
      isOnline: true,
    },
  ];
}
