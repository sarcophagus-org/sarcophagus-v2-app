import { BigNumber, ethers } from 'ethers';
import { Actions } from '..';
import { ActionType } from './actions';

export interface BundlrState {
  balance: BigNumber;
  isFunding: boolean;
  isUploading: boolean;
  uploadProgress: number;
  txId: string | null;
  balanceOffset: BigNumber;
}

export const bundlrInitialState: BundlrState = {
  balance: ethers.constants.Zero,
  isFunding: false,
  isUploading: false,
  uploadProgress: 0,
  txId: null,
  balanceOffset: ethers.constants.Zero,
};

export function bundlrReducer(state: BundlrState, action: Actions): BundlrState {
  switch (action.type) {
    case ActionType.SetBalance:
      return { ...state, balance: action.payload.balance };

    case ActionType.SetIsFunding:
      return { ...state, isFunding: action.payload.isFunding };

    case ActionType.SetIsUploading:
      return { ...state, isUploading: action.payload.isUploading };

    case ActionType.SetUploadProgress:
      return { ...state, uploadProgress: action.payload.uploadProgress };

    case ActionType.SetTxId:
      const txId = action.payload.txId;
      return { ...state, txId };

    case ActionType.Fund:
      return { ...state, balanceOffset: state.balanceOffset.add(action.payload.amount) };

    case ActionType.Withdraw:
      return { ...state, balanceOffset: state.balanceOffset.sub(action.payload.amount) };

    case ActionType.ResetBalanceOffset:
      return { ...state, balanceOffset: ethers.constants.Zero };

    default:
      return state;
  }
}
