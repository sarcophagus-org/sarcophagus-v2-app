import { Actions } from '..';
import { ActionType } from './actions';

export interface CreateSarcophagusState {
  publicKey: string | null;
}

export const createSarcophagusInitialState: CreateSarcophagusState = {
  publicKey: null,
};

export function createSarcophagusReducer(
  state: CreateSarcophagusState,
  action: Actions
): CreateSarcophagusState {
  switch (action.type) {
    case ActionType.SetPublicKey:
      const publicKey = action.payload.publicKey;
      return { ...state, publicKey };

    default:
      return state;
  }
}
