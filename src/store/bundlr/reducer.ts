import { WebBundlr } from '@bundlr-network/client';
import { Actions } from '..';
import { ActionType } from './actions';

export interface BundlrState {
  isConnected: boolean;
  bundlr: WebBundlr | null;
  txId: string | null;
}

export const bundlrInitialState: BundlrState = {
  isConnected: false,
  bundlr: null,
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

    case ActionType.SetTxId:
      const txId = action.payload.txId;
      return { ...state, txId };

    default:
      return state;
  }
}
