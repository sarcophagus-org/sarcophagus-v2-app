import { ActionMap } from '../ActionMap';

// NOTE: Prefix each action with this namespace. Duplicate action names in other reducers will cause
// unexpected behavior.
export enum ActionType {
  StartLoad = 'APP_START_LOAD',
  StopLoad = 'APP_STOP_LOAD',
  SetTimestampMs = 'APP_SET_TIMESTAMP_MS',
}

type AppPayload = {
  [ActionType.StartLoad]: {
    isLoading: boolean;
  };
  [ActionType.StopLoad]: {
    isLoading: boolean;
  };
  [ActionType.SetTimestampMs]: {
    timestampMs: number;
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

export function setTimestampMs(timestampMs: number): AppActions {
  return {
    type: ActionType.SetTimestampMs,
    payload: {
      timestampMs,
    },
  };
}

export type AppActions = ActionMap<AppPayload>[keyof ActionMap<AppPayload>];
