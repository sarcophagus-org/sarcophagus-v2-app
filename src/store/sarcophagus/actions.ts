import { ActionMap } from '../ActionMap';

// NOTE: Prefix each action with this namespace. Duplicate action names in other reducers will cause
// unexpected behavior.
export enum ActionType {
  UpdateValue = 'SARCOPHAGUS_UPDATE_VALUE',
}

type SarcophagusPayload = {
  [ActionType.UpdateValue]: {
    value: string;
  };
};

export function updateValue(value: string): SarcophagusActions {
  return {
    type: ActionType.UpdateValue,
    payload: {
      value,
    },
  };
}

export type SarcophagusActions = ActionMap<SarcophagusPayload>[keyof ActionMap<SarcophagusPayload>];
