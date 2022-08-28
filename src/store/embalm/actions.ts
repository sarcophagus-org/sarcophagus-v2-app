import { ActionMap } from '../ActionMap';
import { StepStatus } from './reducer';

// NOTE: Prefix each action with this namespace. Duplicate action names in other reducers will cause
// unexpected behavior.
export enum ActionType {
  GoToStep = 'EMBALM_GO_TO_STEP',
  UpdateStepStatus = 'EMBALM_UPDATE_STEP_STATUS',
  ToggleStep = 'EMBALM_TOGGLE_STEP',
  SetExpandedStepIndices = 'EMBALM_SET_EXPANDED_STEP_INDICES',
}

type EmbalmPayload = {
  [ActionType.GoToStep]: {
    id: string;
  };
  [ActionType.UpdateStepStatus]: {
    id: string;
    status: StepStatus;
  };
  [ActionType.ToggleStep]: {
    id: string;
  };
  [ActionType.SetExpandedStepIndices]: {
    indices: number[];
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

export function updateStepStatus(id: string, status: StepStatus): EmbalmActions {
  return {
    type: ActionType.UpdateStepStatus,
    payload: {
      id,
      status,
    },
  };
}

export function toggleStep(id: string): EmbalmActions {
  return {
    type: ActionType.ToggleStep,
    payload: {
      id,
    },
  };
}

export function setExpandedStepIndices(indices: number[]): EmbalmActions {
  return {
    type: ActionType.SetExpandedStepIndices,
    payload: {
      indices,
    },
  };
}
export type EmbalmActions = ActionMap<EmbalmPayload>[keyof ActionMap<EmbalmPayload>];
