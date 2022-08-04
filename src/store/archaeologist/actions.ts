import { Archaeologist } from '../../types';
import { ActionMap } from '../ActionMap';

// NOTE: Prefix each action with this namespace. Duplicate action names in other reducers will cause
// unexpected behavior.
export enum ActionType {
  StoreArchaeologists = 'ARCHAEOLOGIST_GET_ARCHAEOLOGISTS',
}

type ArchaeologistPayload = {
  [ActionType.StoreArchaeologists]: {
    archaeologists: Archaeologist[];
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

export type ArchaeologistActions =
  ActionMap<ArchaeologistPayload>[keyof ActionMap<ArchaeologistPayload>];
