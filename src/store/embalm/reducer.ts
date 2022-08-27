import { steps } from 'features/embalm/stepNavigator/steps';
import { Actions } from '..';
import { ActionType } from './actions';

export enum StepStatus {
  Complete = 'complete',
  NotStarted = 'not_started',
  Started = 'started',
}

export interface EmbalmState {
  // The current step in the embalm process
  currentStepId: string;

  // A mapping of steps to step statuses
  stepStatuses: { [key: string]: StepStatus };
}

export const embalmInitialState: EmbalmState = {
  currentStepId: steps[0].id,

  // Initialize a mapping with each step from steps
  stepStatuses: steps.reduce((acc, step) => ({ ...acc, [step.id]: StepStatus.NotStarted }), {}),
};

export function embalmReducer(state: EmbalmState, action: Actions): EmbalmState {
  switch (action.type) {
    case ActionType.GoToStep:
      return { ...state, currentStepId: action.payload.id };

    case ActionType.UpdateStepStatus:
      // Copy the current state
      const newStepStatuses = Object.assign({}, state.stepStatuses);
      newStepStatuses[action.payload.id] = action.payload.status;
      return { ...state, stepStatuses: newStepStatuses };

    default:
      return state;
  }
}
