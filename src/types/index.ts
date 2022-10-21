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
  signature?: string;
  exception?: ArchaeologistException;
}

export interface ArchaeologistException {
  code: string;
  message: string;
}

export interface ArchaeologistProfile {
  archAddress: string;
  exists: boolean;
  minimumDiggingFee: BigNumber;
  maximumRewrapInterval: BigNumber;
  successes: string[];
  cleanups: string[];
  accusals: string[];
  peerId: string;
}

export interface SignatureWithAccount extends Signature {
  account: string;
}

export interface ArchaeologistEncryptedShard {
  publicKey: string;
  encryptedShard: string;
  unencryptedShardDoubleHash: string;
}

// Temporary
export interface Sarcophagus {
  id: string;
}
