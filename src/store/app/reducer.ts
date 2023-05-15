import { Actions } from '..';
import { ActionType } from './actions';

export interface AppState {
  isLoading: boolean;
  timestampMs: number;
}

export const appInitialState: AppState = {
  isLoading: false,
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
    case ActionType.SetTimestampMs: {
      return { ...state, timestampMs: action.payload.timestampMs };
    }

    default:
      return state;
  }
}
