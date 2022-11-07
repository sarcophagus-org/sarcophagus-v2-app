import { BigNumber } from 'ethers';

export interface ISarcophagus {
  name: string;
  state: number;
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
