import { steps } from 'features/embalm/stepNavigator/steps';
import { ActionMap } from '../ActionMap';
import { StepStatus } from './reducer';

// NOTE: Prefix each action with this namespace. Duplicate action names in other reducers will cause
// unexpected behavior.
export enum ActionType {
  GoToStep = 'EMBALM_GO_TO_STEP',
  UpdateStepStatus = 'EMBALM_UPDATE_STEP_STATUS',
}

type EmbalmPayload = {
  [ActionType.GoToStep]: {
    id: string;
  };
  [ActionType.UpdateStepStatus]: {
    id: string;
    status: StepStatus;
  };
};

export function goToStep(id: string): EmbalmActions {
  return {
    type: ActionType.GoToStep,
    payload: {
      id,
    },
  };
}

export function goToStepByIndex(index: number): EmbalmActions {
  const id = steps[index].id;
  return {
    type: ActionType.GoToStep,
    payload: {
      id,
    },
  };
}

export function updateStepStatus(id: string, status: StepStatus): EmbalmActions {
  return {
    type: ActionType.UpdateStepStatus,
    payload: {
      id,
      status,
    },
  };
}

export type EmbalmActions = ActionMap<EmbalmPayload>[keyof ActionMap<EmbalmPayload>];
