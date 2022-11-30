import { BigNumber } from 'ethers';
import { PeerId } from '@libp2p/interface-peer-id';
import { Connection } from '@libp2p/interface-connection';

export interface Archaeologist {
  publicKey?: string;
  profile: ArchaeologistProfile;
  connection?: Connection;
  isOnline: boolean;
  fullPeerId?: PeerId;
  signature?: string;
  exception?: ArchaeologistException;
}

// TODO: Replace with import from proposed npm package
export enum SarcophagusValidationError {
  UNKNOWN_ERROR,
  MAX_REWRAP_INTERVAL_TOO_LARGE,
  INVALID_ARWEAVE_SHARD,
  DIGGING_FEE_TOO_LOW,
  INVALID_TIMESTAMP,
}

export enum ArchaeologistExceptionCode {
  CONNECTION_EXCEPTION,
  STREAM_EXCEPTION,
  DECLINED_SIGNATURE,
}

export interface ArchaeologistException {
  code: ArchaeologistExceptionCode;
  message: string;
}

export interface SarcophagusArchaeologist {
  diggingFee: number;
  diggingFeesPaid: number;
  unencryptedShardDoubleHash: string;
  unencryptedShard: string;
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

export interface ArchaeologistEncryptedShard {
  publicKey: string;
  encryptedShard: string;
  unencryptedShardDoubleHash: string;
}

export enum SarcophagusState {
  DoesNotExist,
  Active,
  Resurrecting,
  Resurrected,
  Buried,
  Cleaned,
  Accused,
  Failed,
}

// interface SarcophagusNo {
//   id: string;
//   name: string;
//   state: SarcophagusState;
//   minShards: number;
//   resurrectionTime: BigNumber;
//   maximumRewrapInterval: BigNumber;
//   arweaveTxIds: string[];
//   embalmer: string;
//   recipientAddress: string;
//   archaeologists: string[];
// }

export type SarcophagusResponse = SarcophagusResponseContract & { id: string };

export interface SarcophagusResponseContract {
  resurrectionTime: BigNumber;
  isCompromised: boolean;
  name: string;
  threshold: number;
  maximumRewrapInterval: BigNumber;
  arweaveTxIds: [string, string];
  embalmerAddress: string;
  recipientAddress: string;
  archaeologistAddresses: string[];
  publishedKeyShareCount: number;
  hasLockedBond: boolean;
}
