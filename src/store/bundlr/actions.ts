import { WebBundlr } from '@bundlr-network/client';
import { ActionMap } from '../ActionMap';

// NOTE: Prefix each action with this namespace. Duplicate action names in other reducers will cause
// unexpected behavior.
export enum ActionType {
  Connect = 'BUNDLR_CONNECT',
  Disconnect = 'BUNDLR_DISCONNECT',
  SetBundlr = 'BUNDLR_SET',
  SetTxId = 'BUNDLR_SET_TX_ID',
}

type BundlrPayload = {
  [ActionType.Connect]: {};
  [ActionType.Disconnect]: {};
  [ActionType.SetBundlr]: {
    bundlr: WebBundlr | null;
  };
  [ActionType.SetTxId]: {
    txId: string;
  };
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

export function setTxId(txId: string): BundlrActions {
  return {
    type: ActionType.SetTxId,
    payload: {
      txId,
    },
  };
}

export type BundlrActions = ActionMap<BundlrPayload>[keyof ActionMap<BundlrPayload>];
