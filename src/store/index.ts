import React, { createContext, useContext } from 'react';
import { AppActions } from './app/actions';
import { appInitialState, appReducer, AppState } from './app/reducer';
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

export type Actions = AppActions | ArchaeologistActions | SarcophagusActions;

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
  appState: AppState;
  archaeologistState: ArchaeologistState;
  sarcophagusState: SarcophagusState;
}

export const initialState: RootState = {
  appState: appInitialState,
  archaeologistState: archaeologistInitialState,
  sarcophagusState: sarcophagusInitialState,
};

export function storeReducer(state: RootState, action: Actions): RootState {
  return {
    appState: appReducer(state.appState, action),
    archaeologistState: archaeologistReducer(state.archaeologistState, action),
    sarcophagusState: sarcophagusReducer(state.sarcophagusState, action),
  };
}
