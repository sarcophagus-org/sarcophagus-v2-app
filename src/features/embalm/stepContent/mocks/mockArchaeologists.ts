import { Archaeologist } from '../../../../types/index';
import { BigNumber } from 'ethers';

export function mochArchaeologists(): Archaeologist[] {
  return [
    {
      profile: {
        archAddress: '	0xbffb97c13fdf07a703f741846a5f95d9deb43b6a',
        exists: true,
        minimumDiggingFee: BigNumber.from('3'),
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
        archAddress: '	0x9f392fe020797572e899d3a34287db24bb7372c2',
        exists: true,
        minimumDiggingFee: BigNumber.from('4'),
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
        archAddress: '	0xfdeeed4783ca7cbce8b10dd3616ba56ef6950fb5',
        exists: true,
        minimumDiggingFee: BigNumber.from('1'),
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
        archAddress: '	0x11680e55b13b38fe90b9e83ab53323775482c286',
        exists: true,
        minimumDiggingFee: BigNumber.from('2'),
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
        archAddress: '	0x5a1979771c5a09b0e322dedbb5930b61714dbaa3',
        exists: true,
        minimumDiggingFee: BigNumber.from('5'),
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
        archAddress: '		0x3c6764a063d2668c3bf0a8a4106515b2c7eaa15e',
        exists: true,
        minimumDiggingFee: BigNumber.from('6'),
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
        archAddress: '		0x0000000000000000000000000000000000000001',
        exists: true,
        minimumDiggingFee: BigNumber.from('7'),
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
