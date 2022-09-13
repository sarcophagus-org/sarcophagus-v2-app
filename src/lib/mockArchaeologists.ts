// Generates random mock archaeologists for building the interface.
// TODO: Remove this when we have real archaeologists.

import { BigNumber } from 'ethers';
import { Archaeologist } from 'types';
import { generateFakeAddress, randomIntFromInterval } from './utils/helpers';

export function generateMockArchaeoloigsts() {
  const count = 10;
  const minDiggingFee = 10;
  const maxDiggingFee = 50;
  let mockArchaeologists: Archaeologist[] = [];
  for (let i = 0; i < count; i++) {
    mockArchaeologists.push({
      publicKey: '0x0',
      address: generateFakeAddress(),
      diggingFee: BigNumber.from(randomIntFromInterval(minDiggingFee, maxDiggingFee)),
      connection: null,
    });
  }
  return mockArchaeologists;
}
