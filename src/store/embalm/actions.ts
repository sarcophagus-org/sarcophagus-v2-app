import { Archaeologist, ArchaeologistException } from 'types/index';
import { ActionMap } from '../ActionMap';
import { Step, StepStatus } from './reducer';
import { PeerId } from '@libp2p/interface-peer-id';
import { Connection } from '@libp2p/interface-connection';

// NOTE: Prefix each action with this namespace. Duplicate action names in other reducers will cause
// unexpected behavior.
export enum ActionType {
  DeselectArchaeologist = 'EMBALM_DESELECT_ARCHAEOLOGIST',
  DisableSteps = 'EMBALM_DISABLE_STEPS',
  EnableSteps = 'EMBALM_ENABLE_STEPS',
  GoToStep = 'EMBALM_GO_TO_STEP',
  SelectArchaeologist = 'EMBALM_SELECT_ARCHAEOLOGIST',
  SetArchAddressSearch = 'EMBALM_SET_ARCH_ADDRESS_SEARCH',
  SetArchaeologistConnection = 'EMBALM_SET_ARCHAEOLOGIST_CONNECTION',
  SetArchaeologistOnlineStatus = 'EMBALM_SET_ARCHAEOLOGIST_ONLINE_STATUS',
  SetArchaeologistFullPeerId = 'EMBALM_SET_ARCHAEOLOGIST_FULL_PEER_ID',
  SetArchaeologistPublicKey = 'EMBALM_SET_ARCHAEOLOGIST_PUBLIC_KEY',
  SetArchaeologistSignature = 'EMBALM_SET_ARCHAEOLOGIST_SIGNATURE',
  SetArchaeologists = 'EMBALM_SET_ARCHAEOLOGISTS',
  SetDiggingFeesFilter = 'EMBALM_SET_DIGGING_FEES_FILTER',
  SetUnwrapsFilter = 'EMBALM_SET_UNWRAPS_FILTER',
  SetFailsFilter = 'EMBALM_SET_FAILS_FILTER',
  SetDiggingFeesSortDirection = 'EMBALM_SET_DIGGING_FEES_SORT_DIRECTION',
  SetUnwrapsSortDirection = 'EMBALM_UNWRAPS_SORT_DIRECTION',
  SetFailsSortDirection = 'EMBALM_FAILS_SORT_DIRECTION',
  SetArchsSortDirection = 'EMBALM_ARCHS_SORT_DIRECTION',
  SetExpandedStepIndices = 'EMBALM_SET_EXPANDED_STEP_INDICES',
  SetFile = 'EMBALM_SET_FILE',
  SetName = 'EMBALM_SET_NAME',
  SetNegotiationTimestamp = 'EMBALM_SET_NEGOTIATION_TIMESTAMP',
  SetOuterLayerKeys = 'EMBALM_SET_OUTER_LAYER_KEYS',
  SetPublicKeysReady = 'EMBALM_SET_PUBLIC_KEYS_READY',
  SetRecipientState = 'EMBALM_SET_RECIPIENT_STATE',
  SetRequiredArchaeologists = 'EMBALM_SET_REQUIRED_ARCHAEOLOGISTS',
  SetResurrection = 'EMBALM_SET_RESURRECTION',
  SetResurrectionRadioValue = 'EMBALM_SET_RESURRECTION_RADIO_VALUE',
  SetCustomResurrectionDate = 'EMBALM_SET_CUSTOM_RESURRECTION_DATE',
  SetSelectedArchaeologists = 'EMBALM_SET_SELECTED_ARCHAEOLOGISTS',
  SetUploadPrice = 'EMBALM_SET_UPLOAD_PRICE',
  ToggleStep = 'EMBALM_TOGGLE_STEP',
  UpdateStepStatus = 'EMBALM_UPDATE_STEP_STATUS',
  SetArchaeologistException = 'EMBALM_SET_ARCHAEOLOGIST_EXCEPTION',
  ResetEmbalmState = 'EMBALM_RESET_EMBALM_STATE',
  SetCurrentChainId = 'EMBALM_SET_CURRENT_CHAIN_ID',
}

export enum RecipientSetByOption {
  ADDRESS = 1,
  PUBLIC_KEY,
  GENERATE,
}

export enum GeneratePDFState {
  UNSET,
  GENERATED,
  DOWNLOADED,
}

export enum SortDirection {
  ASC,
  DESC,
  NONE,
}
export interface RecipientState {
  address: string;
  publicKey: string;
  privateKey?: string;
  setByOption: RecipientSetByOption | null;
  generatePDFState?: GeneratePDFState;
}

type EmbalmPayload = {
  [ActionType.DeselectArchaeologist]: { address: string };
  [ActionType.DisableSteps]: {};
  [ActionType.EnableSteps]: {};
  [ActionType.GoToStep]: { step: Step };
  [ActionType.ResetEmbalmState]: {};
  [ActionType.SelectArchaeologist]: { archaeologist: Archaeologist };
  [ActionType.SetArchaeologistConnection]: { peerId: string; connection: Connection | undefined };
  [ActionType.SetArchaeologistFullPeerId]: { peerId: PeerId };
  [ActionType.SetArchaeologistOnlineStatus]: {
    peerId: string;
    isOnline: boolean;
  };
  [ActionType.SetArchaeologistPublicKey]: { peerId: string; publicKey: string };
  [ActionType.SetArchaeologistSignature]: { peerId: string; signature: string };
  [ActionType.SetArchaeologistException]: { peerId: string; exception: ArchaeologistException };
  [ActionType.SetArchaeologists]: { archaeologists: Archaeologist[] };
  [ActionType.SetCustomResurrectionDate]: { date: Date | null };
  [ActionType.SetExpandedStepIndices]: { indices: number[] };
  [ActionType.SetFile]: { file: File };
  [ActionType.SetName]: { name: string };
  [ActionType.SetNegotiationTimestamp]: { negotiationTimestamp: number };
  [ActionType.SetOuterLayerKeys]: { privateKey: string; publicKey: string };
  [ActionType.SetPublicKeysReady]: { publicKeysReady: boolean };
  [ActionType.SetRecipientState]: RecipientState;
  [ActionType.SetRequiredArchaeologists]: { count: number };
  [ActionType.SetResurrection]: { resurrection: number };
  [ActionType.SetResurrectionRadioValue]: { value: string };
  [ActionType.SetSelectedArchaeologists]: { selectedArchaeologists: Archaeologist[] };
  [ActionType.SetUploadPrice]: { price: string };
  [ActionType.ToggleStep]: { step: Step };
  [ActionType.UpdateStepStatus]: { step: Step; status: StepStatus };
  [ActionType.SetDiggingFeesSortDirection]: { direction: SortDirection };
  [ActionType.SetUnwrapsSortDirection]: { direction: SortDirection };
  [ActionType.SetFailsSortDirection]: { direction: SortDirection };
  [ActionType.SetArchsSortDirection]: { direction: SortDirection };
  [ActionType.SetDiggingFeesFilter]: { filter: string };
  [ActionType.SetUnwrapsFilter]: { filter: string };
  [ActionType.SetFailsFilter]: { filter: string };
  [ActionType.SetArchAddressSearch]: { search: string };
  [ActionType.ResetEmbalmState]: {};
  [ActionType.SetCurrentChainId]: { chainId: number | undefined };
};

export function goToStep(step: Step): EmbalmActions {
  return {
    type: ActionType.GoToStep,
    payload: {
      step,
    },
  };
}

export function setArchaeologists(archaeologists: Archaeologist[]): EmbalmActions {
  return {
    type: ActionType.SetArchaeologists,
    payload: {
      archaeologists,
    },
  };
}

export function updateStepStatus(step: Step, status: StepStatus): EmbalmActions {
  return {
    type: ActionType.UpdateStepStatus,
    payload: {
      step,
      status,
    },
  };
}

export function toggleStep(step: Step): EmbalmActions {
  return {
    type: ActionType.ToggleStep,
    payload: {
      step,
    },
  };
}

export function setExpandedStepIndices(indices: number[]): EmbalmActions {
  return {
    type: ActionType.SetExpandedStepIndices,
    payload: {
      indices,
    },
  };
}

export function setName(name: string): EmbalmActions {
  return {
    type: ActionType.SetName,
    payload: {
      name,
    },
  };
}

export function setOuterLayerKeys(privateKey: string, publicKey: string): EmbalmActions {
  return {
    type: ActionType.SetOuterLayerKeys,
    payload: {
      privateKey,
      publicKey,
    },
  };
}

export function setRecipientState(recipientState: RecipientState): EmbalmActions {
  return {
    type: ActionType.SetRecipientState,
    payload: recipientState,
  };
}

export function setFile(file: File): EmbalmActions {
  return {
    type: ActionType.SetFile,
    payload: {
      file,
    },
  };
}

export function setResurrection(resurrection: number): EmbalmActions {
  return {
    type: ActionType.SetResurrection,
    payload: {
      resurrection,
    },
  };
}

export function setResurrectionRadioValue(value: string): EmbalmActions {
  return {
    type: ActionType.SetResurrectionRadioValue,
    payload: {
      value,
    },
  };
}

export function setCustomResurrectionDate(date: Date | null): EmbalmActions {
  return {
    type: ActionType.SetCustomResurrectionDate,
    payload: {
      date,
    },
  };
}

export function setRequiredArchaeologists(count: number): EmbalmActions {
  return {
    type: ActionType.SetRequiredArchaeologists,
    payload: {
      count,
    },
  };
}

export function setUploadPrice(price: string): EmbalmActions {
  return {
    type: ActionType.SetUploadPrice,
    payload: {
      price,
    },
  };
}

export function selectArchaeologist(archaeologist: Archaeologist): EmbalmActions {
  return {
    type: ActionType.SelectArchaeologist,
    payload: {
      archaeologist,
    },
  };
}

export function deselectArchaeologist(address: string): EmbalmActions {
  return {
    type: ActionType.DeselectArchaeologist,
    payload: {
      address,
    },
  };
}

export function setDiggingFeesSortDirection(direction: SortDirection): EmbalmActions {
  return {
    type: ActionType.SetDiggingFeesSortDirection,
    payload: {
      direction,
    },
  };
}

export function setUnwrapsSortDirection(direction: SortDirection): EmbalmActions {
  return {
    type: ActionType.SetUnwrapsSortDirection,
    payload: {
      direction,
    },
  };
}

export function setFailsSortDirection(direction: SortDirection): EmbalmActions {
  return {
    type: ActionType.SetFailsSortDirection,
    payload: {
      direction,
    },
  };
}

export function setArchsSortDirection(direction: SortDirection): EmbalmActions {
  return {
    type: ActionType.SetArchsSortDirection,
    payload: {
      direction,
    },
  };
}

export function setDiggingFeesFilter(filter: string): EmbalmActions {
  return {
    type: ActionType.SetDiggingFeesFilter,
    payload: {
      filter,
    },
  };
}

export function setUnwrapsFilter(filter: string): EmbalmActions {
  return {
    type: ActionType.SetUnwrapsFilter,
    payload: {
      filter,
    },
  };
}

export function setFailsFilter(filter: string): EmbalmActions {
  return {
    type: ActionType.SetFailsFilter,
    payload: {
      filter,
    },
  };
}

export function setArchAddressSearch(search: string): EmbalmActions {
  return {
    type: ActionType.SetArchAddressSearch,
    payload: {
      search,
    },
  };
}

export function setArchaeologistFullPeerId(peerId: PeerId): EmbalmActions {
  return {
    type: ActionType.SetArchaeologistFullPeerId,
    payload: { peerId },
  };
}

export function setArchaeologistConnection(
  peerId: string,
  connection: Connection | undefined
): EmbalmActions {
  return {
    type: ActionType.SetArchaeologistConnection,
    payload: {
      peerId,
      connection,
    },
  };
}

export function setArchaeologistException(
  peerId: string,
  exception: ArchaeologistException
): EmbalmActions {
  return {
    type: ActionType.SetArchaeologistException,
    payload: {
      peerId,
      exception,
    },
  };
}

export function setArchaeologistOnlineStatus(peerId: string, isOnline: boolean): EmbalmActions {
  return {
    type: ActionType.SetArchaeologistOnlineStatus,
    payload: {
      peerId,
      isOnline,
    },
  };
}

export function setArchaeologistPublicKey(peerId: string, publicKey: string): EmbalmActions {
  return {
    type: ActionType.SetArchaeologistPublicKey,
    payload: {
      peerId,
      publicKey,
    },
  };
}

export function setArchaeologistSignature(peerId: string, signature: string): EmbalmActions {
  return {
    type: ActionType.SetArchaeologistSignature,
    payload: {
      peerId,
      signature,
    },
  };
}

export function resetEmbalmState(): EmbalmActions {
  return {
    type: ActionType.ResetEmbalmState,
    payload: {},
  };
}

export function disableSteps(): EmbalmActions {
  return {
    type: ActionType.DisableSteps,
    payload: {},
  };
}

export function enableSteps(): EmbalmActions {
  return {
    type: ActionType.EnableSteps,
    payload: {},
  };
}

export function setCurrentChainId(chainId: number | undefined): EmbalmActions {
  return {
    type: ActionType.SetCurrentChainId,
    payload: {
      chainId,
    },
  };
}

export type EmbalmActions = ActionMap<EmbalmPayload>[keyof ActionMap<EmbalmPayload>];
