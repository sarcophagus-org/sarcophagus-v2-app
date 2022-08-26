import { BigNumber, Signature } from 'ethers';
import { ReactNode } from 'react';

export interface ChildrenOnly {
  children: ReactNode;
}

export interface Archaeologist {
  publicKey: string;
  address: string;
  bounty: BigNumber;
  diggingFee: BigNumber;
  isArweaver: boolean;
  feePerByte: BigNumber;
  maxResurrectionTime: number;
  connection?: any;
}

export interface ContractArchaeologist {
  archAddress: string;
  storageFee: BigNumber;
  diggingFee: BigNumber;
  bounty: BigNumber;
  hashedShard: string;
}

export interface SignatureWithAccount extends Signature {
  account: string;
}

// Temporary
export interface Sarcophagus {
  id: string;
}
