import { removeFromArray } from 'lib/utils/helpers';
import { Actions } from '..';
import { ActionType } from './actions';

export enum StepStatus {
  Complete = 'complete',
  NotStarted = 'not_started',
  Started = 'started',
}

export enum Step {
  NameSarcophagus = 0,
  UploadPayload = 1,
  SetRecipientPublicKey = 2,
  SetResurrection = 3,
  SelectArchaeologists = 4,
  InitializeSarophagus = 5,
  FinalizeSarcophagus = 6,
}

export interface EmbalmState {
  currentStep: Step;
  expandedStepIndices: number[];
  file: File | null;
  name: string;
  publicKey: string;
  stepStatuses: { [key: number]: StepStatus };
  uploadPrice: string;
  recipientAddress: string;
}

export const embalmInitialState: EmbalmState = {
  currentStep: Step.NameSarcophagus,
  expandedStepIndices: [Step.NameSarcophagus],
  file: null,
  name: '',
  publicKey: '',
  stepStatuses: Object.keys(Step).reduce(
    (acc, step) => ({ ...acc, [step]: StepStatus.NotStarted }),
    {}
  ),
  uploadPrice: '',
  recipientAddress: '',
};

function toggleStep(state: EmbalmState, step: Step): EmbalmState {
  const index = step.valueOf();
  const expandedStepIndicesCopy = state.expandedStepIndices.slice();
  if (!expandedStepIndicesCopy.includes(index)) {
    expandedStepIndicesCopy.push(index);
  } else {
    removeFromArray(expandedStepIndicesCopy, index);
  }
  return { ...state, expandedStepIndices: expandedStepIndicesCopy };
}

export function embalmReducer(state: EmbalmState, action: Actions): EmbalmState {
  switch (action.type) {
    case ActionType.GoToStep:
      return { ...state, currentStep: action.payload.step };

    case ActionType.UpdateStepStatus:
      const newStepStatuses = Object.assign({}, state.stepStatuses);
      newStepStatuses[action.payload.step] = action.payload.status;
      return { ...state, stepStatuses: newStepStatuses };

    case ActionType.ToggleStep:
      return toggleStep(state, action.payload.step);

    case ActionType.SetExpandedStepIndices:
      return { ...state, expandedStepIndices: action.payload.indices };

    case ActionType.SetName:
      return { ...state, name: action.payload.name };

    case ActionType.SetPublicKey:
      return { ...state, publicKey: action.payload.publicKey };

    case ActionType.SetFile:
      return { ...state, file: action.payload.file };

    case ActionType.SetUploadPrice:
      return { ...state, uploadPrice: action.payload.price };

    case ActionType.SetRecipientAddress:
      return { ...state, recipientAddress: action.payload.address };

    default:
      return state;
  }
}
