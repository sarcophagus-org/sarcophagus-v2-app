import { StepMap, steps } from 'features/embalm/stepNavigator/steps';
import { removeFromArray } from 'lib/utils/helpers';
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
  expandedStepIndices: number[];
}

export const embalmInitialState: EmbalmState = {
  currentStepId: steps[0].id,

  // Initialize a mapping with each step from steps
  stepStatuses: steps.reduce((acc, step) => ({ ...acc, [step.id]: StepStatus.NotStarted }), {}),
  expandedStepIndices: [],
};

function toggleStep(state: EmbalmState, id: string): EmbalmState {
  const index = StepMap[id].index;
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
      return { ...state, currentStepId: action.payload.id };

    case ActionType.UpdateStepStatus:
      const newStepStatuses = Object.assign({}, state.stepStatuses);
      newStepStatuses[action.payload.id] = action.payload.status;
      return { ...state, stepStatuses: newStepStatuses };

    case ActionType.ToggleStep:
      return toggleStep(state, action.payload.id);

    case ActionType.SetExpandedStepIndices:
      return { ...state, expandedStepIndices: action.payload.indices };

    default:
      return state;
  }
}
