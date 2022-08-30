import { ActionMap } from '../ActionMap';
import { Step, StepStatus } from './reducer';

// NOTE: Prefix each action with this namespace. Duplicate action names in other reducers will cause
// unexpected behavior.
export enum ActionType {
  GoToStep = 'EMBALM_GO_TO_STEP',
  UpdateStepStatus = 'EMBALM_UPDATE_STEP_STATUS',
  ToggleStep = 'EMBALM_TOGGLE_STEP',
  SetExpandedStepIndices = 'EMBALM_SET_EXPANDED_STEP_INDICES',
  SetName = 'EMBALM_SET_NAME',
  SetRecipientKey = 'EMBALM_SET_RECIPIENT_KEY',
  SetPayloadPath = 'EMBALM_SET_PAYLOAD_PATH',
}

type EmbalmPayload = {
  [ActionType.GoToStep]: {
    step: Step;
  };
  [ActionType.UpdateStepStatus]: {
    step: Step;
    status: StepStatus;
  };
  [ActionType.ToggleStep]: {
    step: Step;
  };
  [ActionType.SetExpandedStepIndices]: {
    indices: number[];
  };
  [ActionType.SetName]: {
    name: string;
  };
  [ActionType.SetRecipientKey]: {
    key: string;
  };
  [ActionType.SetPayloadPath]: {
    path: string;
    size?: number;
  };
};

export function goToStep(step: Step): EmbalmActions {
  return {
    type: ActionType.GoToStep,
    payload: {
      step,
    },
  };
}

export function updateStepStatus(step: Step, status: StepStatus): EmbalmActions {
  return {
    type: ActionType.UpdateStepStatus,
    payload: {
      step,
      status,
    },
  };
}

export function toggleStep(step: Step): EmbalmActions {
  return {
    type: ActionType.ToggleStep,
    payload: {
      step,
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

export function setName(name: string): EmbalmActions {
  return {
    type: ActionType.SetName,
    payload: {
      name,
    },
  };
}

export function setRecipientKey(key: string): EmbalmActions {
  return {
    type: ActionType.SetRecipientKey,
    payload: {
      key,
    },
  };
}

export function setPayloadPath(path: string, size?: number): EmbalmActions {
  return {
    type: ActionType.SetPayloadPath,
    payload: {
      path,
      size,
    },
  };
}

export type EmbalmActions = ActionMap<EmbalmPayload>[keyof ActionMap<EmbalmPayload>];
