import { BigNumber, ethers } from 'ethers';
import { Archaeologist } from '../types';
import { sleep } from './helpers';

// Generates a random number between two numbers
function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Returns a random boolean
function randomBoolean(prob: number): boolean {
  return Math.random() >= prob;
}

export async function generateMockArchaeologists(count: number): Promise<Archaeologist[]> {
  // Simulate some loading time
  await sleep(100);

  // Write to file in mock folder
  const mockArchaeologists: Archaeologist[] = [];
  for (let i = 0; i < count; i++) {
    const wallet = ethers.Wallet.createRandom();
    const mockArchaeologist = {
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey,
      address: wallet.address,
      bounty: BigNumber.from(randomNumber(100, 500)),
      diggingFee: BigNumber.from(randomNumber(5, 50)),
      isArweaver: randomBoolean(0.75),
      feePerByte: BigNumber.from(randomNumber(1, 10)),
    };
    mockArchaeologists.push(mockArchaeologist);
  }

  return mockArchaeologists;
}
