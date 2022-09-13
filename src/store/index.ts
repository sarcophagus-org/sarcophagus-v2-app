import React, { createContext, useContext } from 'react';
import { AppActions } from './app/actions';
import { appInitialState, appReducer, AppState } from './app/reducer';
import { BundlrActions } from './bundlr/actions';
import { bundlrInitialState, bundlrReducer, BundlrState } from './bundlr/reducer';
import { EmbalmActions } from './embalm/actions';
import { embalmInitialState, embalmReducer, EmbalmState } from './embalm/reducer';
import { SarcophagusActions } from './sarcophagus/actions';
import {
  sarcophagusInitialState,
  sarcophagusReducer,
  SarcophagusState,
} from './sarcophagus/reducer';

export type Actions = AppActions | SarcophagusActions | BundlrActions | EmbalmActions;

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
  sarcophagusState: SarcophagusState;
  bundlrState: BundlrState;
  embalmState: EmbalmState;
}

export const initialState: RootState = {
  appState: appInitialState,
  sarcophagusState: sarcophagusInitialState,
  bundlrState: bundlrInitialState,
  embalmState: embalmInitialState,
};

export function storeReducer(state: RootState, action: Actions): RootState {
  return {
    appState: appReducer(state.appState, action),
    sarcophagusState: sarcophagusReducer(state.sarcophagusState, action),
    bundlrState: bundlrReducer(state.bundlrState, action),
    embalmState: embalmReducer(state.embalmState, action),
  };
}
