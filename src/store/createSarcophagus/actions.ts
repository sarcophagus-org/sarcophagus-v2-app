import { ActionMap } from '../ActionMap';

// NOTE: Prefix each action with this namespace. Duplicate action names in other reducers will cause
// unexpected behavior.
export enum ActionType {
  SetPublicKey = 'CREATE_SARCO_SET_PUBLIC_KEY_ID',
}

type CreateSarcophagusPayload = {
  [ActionType.SetPublicKey]: {
    publicKey: string;
  };
};

export function setPublicKey(publicKey: string): CreateSarcophagusActions {
  return {
    type: ActionType.SetPublicKey,
    payload: {
      publicKey,
    },
  };
}

export type CreateSarcophagusActions =
  ActionMap<CreateSarcophagusPayload>[keyof ActionMap<CreateSarcophagusPayload>];
