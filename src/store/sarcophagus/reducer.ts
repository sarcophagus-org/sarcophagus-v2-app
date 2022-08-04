import { Actions } from '..';
import { Sarcophagus } from '../../types';
import { ActionType } from './actions';

export interface SarcophagusState {
  sarcophagi: Sarcophagus[];
  value: string;
}

export const sarcophagusInitialState: SarcophagusState = {
  sarcophagi: [],
  value: '',
};

export const sarcophagusReducer = (state: SarcophagusState, action: Actions) => {
  switch (action.type) {
    case ActionType.UpdateValue:
      const value = action.payload.value;
      return { ...state, value };

    default:
      return state;
  }
};
