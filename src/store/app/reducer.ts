import { Libp2p } from 'libp2p';
import { Actions } from '..';
import { ActionType } from './actions';

export interface AppState {
  isLoading: boolean;
  libp2pNode: Libp2p | null;
  timestampMs: number;
}

export const appInitialState: AppState = {
  isLoading: false,
  libp2pNode: null,
  timestampMs: 0,
};

export function appReducer(state: AppState, action: Actions): AppState {
  switch (action.type) {
    case ActionType.StartLoad: {
      return { ...state, isLoading: action.payload.isLoading };
    }
    case ActionType.StopLoad: {
      return { ...state, isLoading: action.payload.isLoading };
    }
    case ActionType.SetLibP2p: {
      return { ...state, libp2pNode: action.payload.libp2pNode };
    }
    case ActionType.SetTimestampMs: {
      return { ...state, timestampMs: action.payload.timestampMs };
    }

    default:
      return state;
  }
}
