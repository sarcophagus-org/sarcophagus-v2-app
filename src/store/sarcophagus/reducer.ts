import { Actions } from '..';
import { Sarcophagus } from '../../types';
import { ActionType } from './actions';

export interface SarcophagiState {
  sarcophagi: Sarcophagus[];
  value: string;
}

export const sarcophagiInitialState: SarcophagiState = {
  sarcophagi: [],
  value: '',
};

export function sarcophagiReducer(state: SarcophagiState, action: Actions): SarcophagiState {
  switch (action.type) {
    case ActionType.UpdateValue:
      const value = action.payload.value;
      return { ...state, value };

    default:
      return state;
  }
}
