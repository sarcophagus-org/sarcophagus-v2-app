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
  balanceOffset: number;
}

export const bundlrInitialState: BundlrState = {
  balance: '0',
  bundlr: null,
  isConnected: false,
  isFunding: false,
  isUploading: false,
  txId: null,
  balanceOffset: 0,
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

    case ActionType.Fund:
      return { ...state, balanceOffset: state.balanceOffset + parseFloat(action.payload.amount) };

    case ActionType.Withdraw:
      return { ...state, balanceOffset: state.balanceOffset - parseFloat(action.payload.amount) };

    case ActionType.ResetBalanceOffset:
      return { ...state, balanceOffset: 0 };

    default:
      return state;
  }
}
