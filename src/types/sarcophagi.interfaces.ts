import { BigNumber } from 'ethers';

export enum SarcophagusState {
  DoesNotExist,
  Active,
  Resurrecting,
  Resurrected,
  Buried,
  Cleaned,
  Accused,
  Failed
}

export interface ISarcophagus {
  archaeologists: string[];
  arweaveArchaeologist: string;
  arweaveTxId: string;
  canBeTransferred: boolean;
  embalmer: string;
  maxResurrectionInterval: BigNumber;
  minShards: number;
  name: string;
  recipientAddress: string;
  resurrectionTime: BigNumber;
  state: SarcophagusState;
  storageFee: BigNumber;
  sarcoId: string;
  confirmations: number;
}
