import { ArchaeologistProfile, Archaeologist } from '../../../../types/index';
import { BigNumber, ethers } from 'ethers';

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function mochArchaeologists(numberOfArcheologists: number): Archaeologist[] {
  const archArray: Archaeologist[] = [];

  for (let i = 0; i < numberOfArcheologists; i++) {
    let randomNumber = getRandomIntInclusive(1000, 5000);
    let id = i.toString();

    let archProfile: ArchaeologistProfile = {
      archAddress: '0x00000000000000000000000000000000000' + randomNumber.toString(),
      exists: true,
      minimumDiggingFee: BigNumber.from(
        ethers.utils.parseEther(getRandomIntInclusive(1, 25).toString())
      ),
      maximumRewrapInterval: BigNumber.from(
        getRandomIntInclusive(20000000000, 60000000000).toString()
      ),
      maximumResurrectionTime: BigNumber.from(
        getRandomIntInclusive(20000000000, 60000000000).toString()
      ),
      freeBond: BigNumber.from('0'),
      successes: BigNumber.from('0'),
      cleanups: BigNumber.from('0'),
      accusals: BigNumber.from('0'),
      failures: BigNumber.from('0'),
      peerId: '00' + id,
    };

    let arch: Archaeologist = {
      profile: archProfile,
      isOnline: true,
    };

    archArray.push(arch);
  }

  return archArray;
}
