import { ActionMap } from '../ActionMap';
import { Step, StepStatus } from './reducer';

// NOTE: Prefix each action with this namespace. Duplicate action names in other reducers will cause
// unexpected behavior.
export enum ActionType {
  GoToStep = 'EMBALM_GO_TO_STEP',
  SetDiggingFees = 'EMBALM_SET_DIGGING_FEES',
  SetExpandedStepIndices = 'EMBALM_SET_EXPANDED_STEP_INDICES',
  SetFile = 'EMBALM_SET_FILE',
  SetName = 'EMBALM_SET_NAME',
  SetOuterLayerKeys = 'EMBALM_SET_OUTER_LAYER_KEYS',
  SetPublicKey = 'EMBALM_SET_PUBLIC_KEY_ID',
  SetRecipientAddress = 'EMBLAM_SET_RECIPIENT_ADDRESS',
  SetResurrection = 'EMBALM_SET_RESURRECTION',
  SetResurrectionRadioValue = 'EMBALM_SET_RESURRECTION_RADIO_VALUE',
  SetRequiredArchaeologists = 'EMBALM_SET_REQUIRED_ARCHAEOLOGISTS',
  SetTotalArchaeologists = 'EMBALM_SET_TOTAL_ARCHAEOLOGISTS',
  SetUploadPrice = 'EMBALM_SET_UPLOAD_PRICE',
  ToggleStep = 'EMBALM_TOGGLE_STEP',
  UpdateStepStatus = 'EMBALM_UPDATE_STEP_STATUS',
}

type EmbalmPayload = {
  [ActionType.GoToStep]: { step: Step };
  [ActionType.SetDiggingFees]: { diggingFees: string };
  [ActionType.SetExpandedStepIndices]: { indices: number[] };
  [ActionType.SetFile]: { file: File };
  [ActionType.SetName]: { name: string };
  [ActionType.SetOuterLayerKeys]: { privateKey: string; publicKey: string };
  [ActionType.SetPublicKey]: { publicKey: string };
  [ActionType.SetRecipientAddress]: { address: string };
  [ActionType.SetRequiredArchaeologists]: { count: string };
  [ActionType.SetResurrection]: { resurrection: number };
  [ActionType.SetResurrectionRadioValue]: { value: string };
  [ActionType.SetTotalArchaeologists]: { count: string };
  [ActionType.SetUploadPrice]: { price: string };
  [ActionType.ToggleStep]: { step: Step };
  [ActionType.UpdateStepStatus]: { step: Step; status: StepStatus };
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

export function setDiggingFees(diggingFees: string): EmbalmActions {
  return {
    type: ActionType.SetDiggingFees,
    payload: {
      diggingFees,
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

export function setOuterLayerKeys(privateKey: string, publicKey: string): EmbalmActions {
  return {
    type: ActionType.SetOuterLayerKeys,
    payload: {
      privateKey,
      publicKey,
    },
  };
}

export function setPublicKey(publicKey: string): EmbalmActions {
  return {
    type: ActionType.SetPublicKey,
    payload: {
      publicKey,
    },
  };
}

export function setFile(file: File): EmbalmActions {
  return {
    type: ActionType.SetFile,
    payload: {
      file,
    },
  };
}

export function setResurrection(resurrection: number): EmbalmActions {
  return {
    type: ActionType.SetResurrection,
    payload: {
      resurrection,
    },
  };
}

export function setResurrectionRadioValue(value: string): EmbalmActions {
  return {
    type: ActionType.SetResurrectionRadioValue,
    payload: {
      value,
    },
  };
}

export function setRequiredArchaeologists(count: string): EmbalmActions {
  return {
    type: ActionType.SetRequiredArchaeologists,
    payload: {
      count,
    },
  };
}

export function setTotalArchaeologists(count: string): EmbalmActions {
  return {
    type: ActionType.SetTotalArchaeologists,
    payload: {
      count,
    },
  };
}

export function setUploadPrice(price: string): EmbalmActions {
  return {
    type: ActionType.SetUploadPrice,
    payload: {
      price,
    },
  };
}

export function setRecipientAddress(address: string): EmbalmActions {
  return {
    type: ActionType.SetRecipientAddress,
    payload: {
      address,
    },
  };
}

export type EmbalmActions = ActionMap<EmbalmPayload>[keyof ActionMap<EmbalmPayload>];
