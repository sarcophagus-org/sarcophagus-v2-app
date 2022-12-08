import { WebBundlr } from '@bundlr-network/client';
import { BigNumber, ethers } from 'ethers';
import { Actions } from '..';
import { ActionType } from './actions';

export interface BundlrState {
  balance: BigNumber;
  bundlr: WebBundlr | null;
  isConnected: boolean;
  isFunding: boolean;
  isUploading: boolean;
  txId: string | null;
  balanceOffset: BigNumber;
}

export const bundlrInitialState: BundlrState = {
  balance: ethers.constants.Zero,
  bundlr: null,
  isConnected: false,
  isFunding: false,
  isUploading: false,
  txId: null,
  balanceOffset: ethers.constants.Zero,
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
      return { ...state, balanceOffset: state.balanceOffset.add(action.payload.amount) };

    case ActionType.Withdraw:
      return { ...state, balanceOffset: state.balanceOffset.sub(action.payload.amount) };

    case ActionType.ResetBalanceOffset:
      return { ...state, balanceOffset: ethers.constants.Zero };

    default:
      return state;
  }
}
