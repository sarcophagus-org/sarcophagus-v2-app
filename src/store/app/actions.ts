import { ActionMap } from '../ActionMap';

// NOTE: Prefix each action with this namespace. Duplicate action names in other reducers will cause
// unexpected behavior.
export enum ActionType {
  StartLoad = 'APP_START_LOAD',
  StopLoad = 'APP_STOP_LOAD',
}

type AppPayload = {
  [ActionType.StartLoad]: {
    isLoading: boolean;
  };
  [ActionType.StopLoad]: {
    isLoading: boolean;
  };
};

export function startLoad(): AppActions {
  return {
    type: ActionType.StartLoad,
    payload: {
      isLoading: true,
    },
  };
}

export function stopLoad(): AppActions {
  return {
    type: ActionType.StopLoad,
    payload: {
      isLoading: false,
    },
  };
}

export type AppActions = ActionMap<AppPayload>[keyof ActionMap<AppPayload>];
