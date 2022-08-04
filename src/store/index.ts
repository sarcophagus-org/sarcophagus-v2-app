import React, { createContext, useContext } from 'react';
import { ArchaeologistActions } from './archaeologist/actions';
import {
  archaeologistInitialState,
  archaeologistReducer,
  ArchaeologistState,
} from './archaeologist/reducer';
import { SarcophagusActions } from './sarcophagus/actions';
import {
  sarcophagusInitialState,
  sarcophagusReducer,
  SarcophagusState,
} from './sarcophagus/reducer';

export type Actions = ArchaeologistActions | SarcophagusActions;

interface Context {
  state: RootState;
  dispatch: React.Dispatch<Actions>;
}

export const StoreContext = createContext<Context>({} as Context);

export function useSelector<T>(select: (state: RootState) => T): T {
  const { state } = useContext(StoreContext);
  return select(state);
}

export function useDispatch(): React.Dispatch<Actions> {
  const { dispatch } = useContext(StoreContext);
  return dispatch;
}

export interface RootState {
  archaeologistState: ArchaeologistState;
  sarcophagusState: SarcophagusState;
}

export const initialState: RootState = {
  archaeologistState: archaeologistInitialState,
  sarcophagusState: sarcophagusInitialState,
};

export function storeReducer(
  state: RootState,
  action: ArchaeologistActions | SarcophagusActions
): RootState {
  return {
    archaeologistState: archaeologistReducer(state.archaeologistState, action),
    sarcophagusState: sarcophagusReducer(state.sarcophagusState, action),
  };
}
