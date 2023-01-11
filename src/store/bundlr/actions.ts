import { WebBundlr } from '@bundlr-network/client';
import { BigNumber } from 'ethers';
import { ActionMap } from '../ActionMap';

// NOTE: Prefix each action with this namespace. Duplicate action names in other reducers will cause
// unexpected behavior.
export enum ActionType {
  Connect = 'BUNDLR_CONNECT',
  Disconnect = 'BUNDLR_DISCONNECT',
  Fund = 'BUNDLR_FUND',
  SetBalance = 'BUNDLR_SET_BALANCE',
  SetBundlr = 'BUNDLR_SET',
  SetIsFunding = 'BUNDLR_SET_IS_FUNDING',
  SetIsUploading = 'BUNDLR_SET_IS_UPLOADING',
  SetUploadProgress = 'BUNDLR_SET_UPLOAD_PROGRESS',
  SetTxId = 'BUNDLR_SET_TX_ID',
  Withdraw = 'BUNDLR_WITHDRAW',
  ResetBalanceOffset = 'BUNDLR_RESET_BALANCE_OFFSET',
}

type BundlrPayload = {
  [ActionType.Connect]: {};
  [ActionType.Disconnect]: {};
  [ActionType.Fund]: { amount: BigNumber };
  [ActionType.SetBalance]: { balance: BigNumber };
  [ActionType.SetBundlr]: { bundlr: WebBundlr | null };
  [ActionType.SetIsFunding]: { isFunding: boolean };
  [ActionType.SetIsUploading]: { isUploading: boolean };
  [ActionType.SetUploadProgress]: { uploadProgress: number };
  [ActionType.SetTxId]: { txId: string };
  [ActionType.Withdraw]: { amount: string };
  [ActionType.ResetBalanceOffset]: {};
};

export function connect(): BundlrActions {
  return {
    type: ActionType.Connect,
    payload: {},
  };
}

export function disconnect(): BundlrActions {
  return {
    type: ActionType.Disconnect,
    payload: {},
  };
}

export function setBundlr(bundlr: WebBundlr | null): BundlrActions {
  return {
    type: ActionType.SetBundlr,
    payload: {
      bundlr,
    },
  };
}

export function setBalance(balance: BigNumber): BundlrActions {
  return {
    type: ActionType.SetBalance,
    payload: {
      balance,
    },
  };
}

export function setIsFunding(isFunding: boolean): BundlrActions {
  return {
    type: ActionType.SetIsFunding,
    payload: {
      isFunding,
    },
  };
}
export function setIsUploading(isUploading: boolean): BundlrActions {
  return {
    type: ActionType.SetIsUploading,
    payload: {
      isUploading,
    },
  };
}
export function setUploadProgress(uploadProgress: number): BundlrActions {
  return {
    type: ActionType.SetUploadProgress,
    payload: {
      uploadProgress,
    },
  };
}

export function fund(amount: BigNumber): BundlrActions {
  return {
    type: ActionType.Fund,
    payload: {
      amount,
    },
  };
}

export function withdraw(amount: string): BundlrActions {
  return {
    type: ActionType.Withdraw,
    payload: {
      amount,
    },
  };
}

export function resetBalanceOffset(): BundlrActions {
  return {
    type: ActionType.ResetBalanceOffset,
    payload: {},
  };
}

export type BundlrActions = ActionMap<BundlrPayload>[keyof ActionMap<BundlrPayload>];
