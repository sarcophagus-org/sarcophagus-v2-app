import { Archaeologist } from '../../types';
import { ActionMap } from '../ActionMap';

// NOTE: Prefix each action with this namespace. Duplicate action names in other reducers will cause
// unexpected behavior.
export enum ActionType {
  StoreArchaeologists = 'ARCHAEOLOGIST_STORE_ARCHAEOLOGISTS',
  SetArchaeologistsRequired = 'ARCHAEOLOGIST_SET_ARCHAEOLOGISTS_REQUIRED',
  SetSelectedArchaeologists = 'ARCHAEOLOGIST_SET_SELECTED_ARCHAEOLOGISTS',
  SelectArchaeologist = 'ARCHAEOLOGIST_SELECT_ARCHAEOLOGIST',
  DeselectArchaeologist = 'ARCHAEOLOGIST_DESELECT_ARCHAEOLOGIST',
}

type ArchaeologistPayload = {
  [ActionType.StoreArchaeologists]: {
    archaeologists: Archaeologist[];
  };
  [ActionType.SetArchaeologistsRequired]: {
    archaeologistsRequired: number;
  };
  [ActionType.SetSelectedArchaeologists]: {
    selectedArchaeologists: Archaeologist[];
  };
  [ActionType.SelectArchaeologist]: {
    arch: Archaeologist;
  };
  [ActionType.DeselectArchaeologist]: {
    arch: Archaeologist;
  };
};

export function storeArchaeologists(archaeologists: Archaeologist[]): ArchaeologistActions {
  return {
    type: ActionType.StoreArchaeologists,
    payload: {
      archaeologists,
    },
  };
}

export function setArchaeologistsRequired(archaeologistsRequired: number): ArchaeologistActions {
  return {
    type: ActionType.SetArchaeologistsRequired,
    payload: {
      archaeologistsRequired,
    },
  };
}

export function setSelectedArchaeologists(selectedArchaeologists: Archaeologist[]): ArchaeologistActions {
  return {
    type: ActionType.SetSelectedArchaeologists,
    payload: {
      selectedArchaeologists,
    },
  };
}

export function selectArchaeologist(arch: Archaeologist): ArchaeologistActions {
  return {
    type: ActionType.SelectArchaeologist,
    payload: {
      arch,
    },
  };
}

export function deselectArchaeologist(arch: Archaeologist): ArchaeologistActions {
  return {
    type: ActionType.DeselectArchaeologist,
    payload: {
      arch,
    },
  };
}

export type ArchaeologistActions =
  ActionMap<ArchaeologistPayload>[keyof ActionMap<ArchaeologistPayload>];
