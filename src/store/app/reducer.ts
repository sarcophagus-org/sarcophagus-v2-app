import { Actions } from '..';
import { ActionType } from './actions';

export interface AppState {
  isLoading: boolean;
}

export const appInitialState: AppState = {
  isLoading: false,
};

export function appReducer(state: AppState, action: Actions): AppState {
  switch (action.type) {
    case ActionType.StartLoad:
      return { ...state, isLoading: action.payload.isLoading };
    case ActionType.StopLoad:
      return { ...state, isLoading: action.payload.isLoading };

    default:
      return state;
  }
}
