import { BigNumber, Signature } from 'ethers';
import { ReactNode } from 'react';
import { PeerId } from '@libp2p/interface-peer-id';
import { Connection } from '@libp2p/interface-connection';

export interface ChildrenOnly {
  children: ReactNode;
}

export interface Archaeologist {
  publicKey?: string;
  profile: ArchaeologistProfile;
  connection?: Connection;
  isOnline: boolean;
  fullPeerId?: PeerId;
  lastPinged?: Date;
}

export interface SelectedContractArchaeologist {
  archAddress: string;
  diggingFee: BigNumber;
  unencryptedShardDoubleHash: string;
  v: number;
  r: string;
  s: string;
}

export interface ArchaeologistProfile {
  archAddress: string;
  exists: boolean;
  minimumDiggingFee: BigNumber;
  maximumRewrapInterval: number;
  peerId: string;

  signature: {
    v: number;
    r: string;
    s: string;
  };
}

export interface SignatureWithAccount extends Signature {
  account: string;
}

// Temporary
export interface Sarcophagus {
  id: string;
}
