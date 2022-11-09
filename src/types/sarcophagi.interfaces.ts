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
}

export interface ISarcophagus {
  name: string;
  state: SarcophagusState;
  canBeTransferred: boolean;
  minShards: number;
  resurrectionTime: BigNumber;
  maximumRewrapInterval: BigNumber;
  arweaveTxIds: string[];
  embalmer: string;
  recipientAddress: string;
  archaeologists: string[];
  sarcoId: string;
}
