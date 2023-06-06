export enum ArweaveTxStatus {
  PENDING,
  SUCCESS,
  FAIL,
}

export interface ArweaveFileMetadata {
  fileName: string;
  type: string;
}
