import { BigNumber } from 'ethers';

// TODO: Replace with import from proposed npm package
export enum SarcophagusValidationError {
  UNKNOWN_ERROR,
  MAX_REWRAP_INTERVAL_TOO_LARGE,
  DIGGING_FEE_TOO_LOW,
  INVALID_TIMESTAMP,
  MAX_RESURRECTION_TIME_TOO_LARGE,
  CURSE_FEE_TOO_LOW,
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
  diggingFeePerSecond: BigNumber;
  curseFee: BigNumber;
  isAccused: boolean;
  publicKey: string;
  privateKey: string;
}

export interface ArchaeologistProfile {
  accusals: BigNumber;
  archAddress: string;
  failures: BigNumber;
  freeBond: BigNumber;
  maximumRewrapInterval: BigNumber;
  maximumResurrectionTime: BigNumber;
  minimumDiggingFeePerSecond: BigNumber;
  peerId: string;
  successes: BigNumber;
  curseFee: BigNumber;
}

export interface ArchaeologistEncryptedShard {
  publicKey: string;
  encryptedShard: string;
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
  CleanedResurrected,
  CleanedFailed,
}

export type Sarcophagus = SarcophagusResponseContract & { id: string; state: SarcophagusState };

export interface SarcophagusResponseContract {
  resurrectionTime: BigNumber;
  isCompromised: boolean;
  isCleaned: boolean;
  name: string;
  threshold: number;
  cursedBondPercentage: number;
  maximumRewrapInterval: BigNumber;
  arweaveTxId: string;
  embalmerAddress: string;
  recipientAddress: string;
  archaeologistAddresses: string[];
  publishedPrivateKeyCount: number;
  hasLockedBond: boolean;
  previousRewrapTime: BigNumber;
}

export interface ArweavePayload {
  file: Buffer;
  keyShares: Record<string, string>;
}

export type Address = `0x${string}`;
