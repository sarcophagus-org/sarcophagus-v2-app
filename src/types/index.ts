import { BigNumber } from 'ethers';

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
