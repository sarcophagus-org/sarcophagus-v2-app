import { Archaeologist } from '../../types';
import { ActionMap } from '../ActionMap';

export enum Types {
  Test = 'TEST_ACTION'
}

interface ArchaeologistPayload  {
  [Types.Test]: {
    id: number;
    account: string;
  };
}

export type ArchaeologistActions = ActionMap<ArchaeologistPayload>[keyof ActionMap<
  ArchaeologistPayload
>];


export const archaeologistReducer = (state: Archaeologist[], action: ArchaeologistActions) => {
    switch (action.type) {
    case Types.Test:
      return [
        ...state,
        {
          id: action.payload.id,
          account: action.payload.account,
        }
      ];
    default:
      return state;
  }
};