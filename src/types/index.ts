import { BigNumber } from 'ethers';
import { ReactNode } from 'react';

export interface ChildrenOnly {
  children: ReactNode;
}

export interface Archaeologist {
  privateKey: string; // TODO: Remove this later
  publicKey: string;
  address: string;
  bounty: BigNumber;
  diggingFee: BigNumber;
  isArweaver: boolean;
  feePerByte: BigNumber;
}

// Temporary
export interface Sarcophagus {
  id: string;
}
