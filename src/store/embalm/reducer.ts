import { Actions } from '..';
import { ActionType } from './actions';

export enum StepStatus {
  Complete = 'complete',
  NotStarted = 'not_started',
  Started = 'started',
}

export enum StepName {
  NameSarcophagusAndAddRecipient = 'NAME_SARCOPHAGS_AND_ADD_RECIPIENT',
  UploadPayload = 'UPLOAD_PAYLOAD',
  CreateRecipientKeypair = 'CREATE_RECIPIENT_KEYPAIR',
  SetResurrectionDate = 'SET_RESURRECTION_DATE',
  SetArchaeologistBounties = 'SET_ARCHAEOLOGIST_BOUNTIES',
  SelectArchaeologists = 'SELECT_ARCHAEOLOGISTS',
}

export interface Step {
  name: StepName;
  status: StepStatus;
  title: string;
  subTitle: string;
}

export interface EmbalmState {
  // The current step in the embalm process
  currentStep: StepName;

  // stepStatuses is a mapping of step names to step statuses
  // Tracks the completion status of each step in the embalm process
  stepStatuses: { [key: string]: StepStatus };
}

export const embalmInitialState: EmbalmState = {
  currentStep: StepName.NameSarcophagusAndAddRecipient,
  stepStatuses: {
    [StepName.NameSarcophagusAndAddRecipient]: StepStatus.NotStarted,
    [StepName.UploadPayload]: StepStatus.NotStarted,
    [StepName.CreateRecipientKeypair]: StepStatus.NotStarted,
    [StepName.SetResurrectionDate]: StepStatus.NotStarted,
    [StepName.SetArchaeologistBounties]: StepStatus.NotStarted,
    [StepName.SelectArchaeologists]: StepStatus.NotStarted,
  },
};

export function embalmReducer(state: EmbalmState, action: Actions): EmbalmState {
  switch (action.type) {
    case ActionType.GoToStep:
      return { ...state, currentStep: action.payload.name };

    case ActionType.UpdateStepStatus:
      // Copy the current state
      const newStepStatuses = Object.assign({}, state.stepStatuses);
      newStepStatuses[action.payload.name] = action.payload.status;
      return { ...state, stepStatuses: newStepStatuses };

    default:
      return state;
  }
}
