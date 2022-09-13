import { BigNumber, Signature } from 'ethers';
import { ReactNode } from 'react';

export interface ChildrenOnly {
  children: ReactNode;
}

export interface Archaeologist {
  publicKey?: string;
  profile: ArchaeologistProfile;
  connection?: any;
  isOnline: boolean;
}

export interface SelectedContractArchaeologist {
  archAddress: string;
  diggingFee: BigNumber;
  storageFee: BigNumber;
  hashedShard?: string;
}

export interface ArchaeologistProfile {
  archAddress: string,
  exists: boolean;
  minimumDiggingFee: BigNumber;
  maximumRewrapInterval: number;
  peerId: string;
}

export interface SignatureWithAccount extends Signature {
  account: string;
}

// Temporary
export interface Sarcophagus {
  id: string;
}
