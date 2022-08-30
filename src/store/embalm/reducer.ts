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
  CreateRecipientKeypair = 2,
  SetResurrection = 3,
  SelectArchaeologists = 4,
  InitializeSarophagus = 5,
  FinalizeSarcophagus = 6,
}

export interface EmbalmState {
  currentStep: Step;
  expandedStepIndices: number[];
  name: string;
  payloadPath: string;
  payloadSize: number;
  recipientPublicKey: string;
  stepStatuses: { [key: number]: StepStatus };
}

export const embalmInitialState: EmbalmState = {
  currentStep: Step.NameSarcophagus,
  expandedStepIndices: [Step.NameSarcophagus],
  name: '',
  payloadPath: '',
  payloadSize: 0,
  recipientPublicKey: '',
  stepStatuses: Object.keys(Step).reduce(
    (acc, step) => ({ ...acc, [step]: StepStatus.NotStarted }),
    {}
  ),
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

    case ActionType.SetRecipientKey:
      return { ...state, recipientPublicKey: action.payload.key };

    case ActionType.SetPayloadPath:
      return { ...state, payloadPath: action.payload.path, payloadSize: action.payload.size || 0 };

    default:
      return state;
  }
}
