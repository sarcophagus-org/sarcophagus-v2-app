import { Actions } from '..';
import { Archaeologist } from '../../types';
import { ActionType } from './actions';

export interface ArchaeologistState {
  archaeologists: Archaeologist[];
  archaeologistsRequired: number;
  selectedArchaeologists: Archaeologist[];
}

export const archaeologistInitialState: ArchaeologistState = {
  archaeologists: [],
  archaeologistsRequired: 3,
  selectedArchaeologists: [],
};

export function archaeologistReducer(
  state: ArchaeologistState,
  action: Actions
): ArchaeologistState {
  switch (action.type) {
    case ActionType.StoreArchaeologists:
      const archaeologists = action.payload.archaeologists;
      return { ...state, archaeologists };

    case ActionType.SetArchaeologistsRequired:
      const archaeologistsRequired = action.payload.archaeologistsRequired;
      return { ...state, archaeologistsRequired };

    case ActionType.SetSelectedArchaeologists:
      const selectedArchaeologists = action.payload.selectedArchaeologists;
      return { ...state, selectedArchaeologists };

    case ActionType.SelectArchaeologist:
      return {
        ...state,
        selectedArchaeologists: [...state.selectedArchaeologists, action.payload.arch],
      };

    case ActionType.DeselectArchaeologist:
      return {
        ...state,
        selectedArchaeologists: state.selectedArchaeologists.filter(
          a => a !== action.payload.arch
        ),
      };
    default:
      return state;
  }
}
