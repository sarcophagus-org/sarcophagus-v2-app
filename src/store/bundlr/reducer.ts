import { WebBundlr } from '@bundlr-network/client';
import { Actions } from '..';
import { ActionType } from './actions';

export interface BundlrState {
  balance: string;
  bundlr: WebBundlr | null;
  isConnected: boolean;
  isFunding: boolean;
  isUploading: boolean;
  txId: string | null;
}

export const bundlrInitialState: BundlrState = {
  balance: '',
  bundlr: null,
  isConnected: false,
  isFunding: false,
  isUploading: false,
  txId: null,
};

export function bundlrReducer(state: BundlrState, action: Actions): BundlrState {
  switch (action.type) {
    case ActionType.Connect:
      return { ...state, isConnected: true };

    case ActionType.Disconnect:
      return { ...state, isConnected: false, bundlr: null };

    case ActionType.SetBundlr:
      const bundlr = action.payload.bundlr;
      return { ...state, bundlr };

    case ActionType.SetBalance:
      return { ...state, balance: action.payload.balance };

    case ActionType.SetIsFunding:
      return { ...state, isFunding: action.payload.isFunding };

    case ActionType.SetTxId:
      const txId = action.payload.txId;
      return { ...state, txId };

    case ActionType.SetIsUploading:
      return { ...state, isUploading: action.payload.isUploading };

    default:
      return state;
  }
}
