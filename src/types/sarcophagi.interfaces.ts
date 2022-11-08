import { BigNumber } from 'ethers';

export interface ISarcophagus {
  archaeologists: string[];
  arweaveArchaeologist: string;
  arweaveTxId: string;
  embalmer: string;
  maxResurrectionInterval: BigNumber;
  minShards: number;
  name: string;
  recipientAddress: string;
  resurrectionTime: BigNumber;
  state: number;
  storageFee: BigNumber;
  sarcoId: string;
}
