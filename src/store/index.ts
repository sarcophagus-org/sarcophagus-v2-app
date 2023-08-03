import React, { createContext, useContext } from 'react';
import { AppActions } from './app/actions';
import { appInitialState, appReducer, AppState } from './app/reducer';
import { BundlrActions } from './bundlr/actions';
import { bundlrInitialState, bundlrReducer, BundlrState } from './bundlr/reducer';
import { EmbalmActions } from './embalm/actions';
import { embalmInitialState, embalmReducer, EmbalmState } from './embalm/reducer';
import { SarcophagusActions } from './sarcophagus/actions';
import { sarcophagiInitialState, sarcophagiReducer, SarcophagiState } from './sarcophagus/reducer';
import { ArchaeologistListActions } from './archaeologistList/actions';
import {
  archaeologistListInitialState,
  archaeologistListReducer,
  ArchaeologistListState,
} from './archaeologistList/reducer';

export type Actions =
  | AppActions
  | SarcophagusActions
  | BundlrActions
  | EmbalmActions
  | ArchaeologistListActions;

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
  sarcophagiState: SarcophagiState;
  bundlrState: BundlrState;
  embalmState: EmbalmState;
  archaeologistListState: ArchaeologistListState;
}

export const initialState: RootState = {
  appState: appInitialState,
  sarcophagiState: sarcophagiInitialState,
  bundlrState: bundlrInitialState,
  embalmState: embalmInitialState,
  archaeologistListState: archaeologistListInitialState,
};

export function storeReducer(state: RootState, action: Actions): RootState {
  return {
    appState: appReducer(state.appState, action),
    sarcophagiState: sarcophagiReducer(state.sarcophagiState, action),
    bundlrState: bundlrReducer(state.bundlrState, action),
    embalmState: embalmReducer(state.embalmState, action),
    archaeologistListState: archaeologistListReducer(state.archaeologistListState, action),
  };
}
