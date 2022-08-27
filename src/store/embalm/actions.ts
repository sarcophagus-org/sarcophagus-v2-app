import { ActionMap } from '../ActionMap';
import { StepName, StepStatus } from './reducer';

// NOTE: Prefix each action with this namespace. Duplicate action names in other reducers will cause
// unexpected behavior.
export enum ActionType {
  GoToStep = 'EMBALM_GO_TO_STEP',
  UpdateStepStatus = 'EMBALM_UPDATE_STEP_STATUS',
}

type EmbalmPayload = {
  [ActionType.GoToStep]: {
    name: StepName;
  };
  [ActionType.UpdateStepStatus]: {
    name: StepName;
    status: StepStatus;
  };
};

export function goToStep(name: StepName): EmbalmActions {
  return {
    type: ActionType.GoToStep,
    payload: {
      name,
    },
  };
}

export function updateStepStatus(name: StepName, status: StepStatus): EmbalmActions {
  return {
    type: ActionType.UpdateStepStatus,
    payload: {
      name,
      status,
    },
  };
}

export type EmbalmActions = ActionMap<EmbalmPayload>[keyof ActionMap<EmbalmPayload>];
