import { BigNumber, Signature } from 'ethers';
import { ReactNode } from 'react';

export interface ChildrenOnly {
  children: ReactNode;
}

export interface Archaeologist {
  publicKey?: string;
  profile: ContractArchaeologist;
  connection?: any;
}

export interface ContractArchaeologist {
  archAddress: string;
  diggingFee: BigNumber;
  maxResurrectionInterval: number;
  hashedShard?: string;
}

export interface SignatureWithAccount extends Signature {
  account: string;
}

// Temporary
export interface Sarcophagus {
  id: string;
}
