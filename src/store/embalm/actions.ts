import { Archaeologist, ArchaeologistEncryptedShard } from 'types/index';
import { ActionMap } from '../ActionMap';
import { Step, StepStatus } from './reducer';
import { PeerId } from '@libp2p/interface-peer-id';
import { Connection } from '@libp2p/interface-connection';

// NOTE: Prefix each action with this namespace. Duplicate action names in other reducers will cause
// unexpected behavior.
export enum ActionType {
  DeselectArchaeologist = 'EMBALM_DESELECT_ARCHAEOLOGIST',
  GoToStep = 'EMBALM_GO_TO_STEP',
  SelectArchaeologist = 'EMBALM_SELECT_ARCHAEOLOGIST',
  SetArchaeologistConnection = 'EMBALM_SET_ARCHAEOLOGIST_CONNECTION',
  SetArchaeologistSignature = 'EMBALM_SET_ARCHAEOLOGIST_SIGNATURE',
  SetArchaeologistOnlineStatus = 'EMBALM_SET_ARCHAEOLOGIST_ONLINE_STATUS',
  SetArchaeologistFullPeerId = 'EMBALM_SET_ARCHAEOLOGIST_FULL_PEER_ID',
  SetArchaeologistPublicKey = 'EMBALM_SET_ARCHAEOLOGIST_PUBLIC_KEY',
  SetArchaeologists = 'EMBALM_SET_ARCHAEOLOGISTS',
  SetDiggingFees = 'EMBALM_SET_DIGGING_FEES',
  SetExpandedStepIndices = 'EMBALM_SET_EXPANDED_STEP_INDICES',
  SetFile = 'EMBALM_SET_FILE',
  SetName = 'EMBALM_SET_NAME',
  SetOuterLayerKeys = 'EMBALM_SET_OUTER_LAYER_KEYS',
  SetRecipientState = 'EMBALM_SET_RECIPIENT_STATE',
  SetRequiredArchaeologists = 'EMBALM_SET_REQUIRED_ARCHAEOLOGISTS',
  SetResurrection = 'EMBALM_SET_RESURRECTION',
  SetResurrectionRadioValue = 'EMBALM_SET_RESURRECTION_RADIO_VALUE',
  SetCustomResurrectionDate = 'EMBALM_SET_CUSTOM_RESURRECTION_DATE',
  SetSelectedArchaeologists = 'EMBALM_SET_SELECTED_ARCHAEOLOGISTS',
  SetTotalArchaeologists = 'EMBALM_SET_TOTAL_ARCHAEOLOGISTS',
  SetUploadPrice = 'EMBALM_SET_UPLOAD_PRICE',
  ToggleStep = 'EMBALM_TOGGLE_STEP',
  UpdateStepStatus = 'EMBALM_UPDATE_STEP_STATUS',
  SetDiggingFeesSortDirection = 'EMBALM_SET_DIGGING_FEES_SORT_DIRECTION',
  SetDiggingFeesFilter = 'EMBALM_SET_DIGGING_FEES_FILTER',
  SetArchAddressSearch = 'EMBALM_SET_ARCH_ADDRESS_SEARCH',
  SetShardPayloadData = 'EMBALM_SET_SHARD_PAYLOAD_DATA',
  SetPublicKeysReady = 'EMBALM_SET_PUBLIC_KEYS_READY',
  SetSignaturesReady = 'EMBALM_SET_SIGNATURES_READY',
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
  [ActionType.GoToStep]: { step: Step };
  [ActionType.SelectArchaeologist]: { archaeologist: Archaeologist };
  [ActionType.SetArchaeologistConnection]: {
    peerId: string;
    connection: Connection | undefined;
  };
  [ActionType.SetArchaeologistSignature]: {
    peerId: string;
    signature: string;
  };
  [ActionType.SetArchaeologistOnlineStatus]: {
    peerId: string;
    isOnline: boolean;
    lastPinged?: Date;
  };
  [ActionType.SetArchaeologistFullPeerId]: { peerId: PeerId };
  [ActionType.SetArchaeologistPublicKey]: { peerId: string; publicKey: string };
  [ActionType.SetArchaeologists]: { archaeologists: Archaeologist[] };
  [ActionType.SetDiggingFees]: { diggingFees: string };
  [ActionType.SetExpandedStepIndices]: { indices: number[] };
  [ActionType.SetFile]: { file: File };
  [ActionType.SetName]: { name: string };
  [ActionType.SetOuterLayerKeys]: { privateKey: string; publicKey: string };
  [ActionType.SetRecipientState]: RecipientState;
  [ActionType.SetRequiredArchaeologists]: { count: string };
  [ActionType.SetResurrection]: { resurrection: number };
  [ActionType.SetResurrectionRadioValue]: { value: string };
  [ActionType.SetCustomResurrectionDate]: { date: Date | null };
  [ActionType.SetSelectedArchaeologists]: { archaeologists: Archaeologist[] };
  [ActionType.SetTotalArchaeologists]: { count: string };
  [ActionType.SetUploadPrice]: { price: string };
  [ActionType.ToggleStep]: { step: Step };
  [ActionType.UpdateStepStatus]: { step: Step; status: StepStatus };
  [ActionType.SetDiggingFeesSortDirection]: { direction: SortDirection };
  [ActionType.SetDiggingFeesFilter]: { filter: string };
  [ActionType.SetArchAddressSearch]: { search: string };
  [ActionType.SetShardPayloadData]: {
    shards: ArchaeologistEncryptedShard[],
    sarcophagusPayloadTxId: string,
    encryptedShardsTxId: string
  };
  [ActionType.SetPublicKeysReady]: { publicKeysReady: boolean };
  [ActionType.SetSignaturesReady]: { signaturesReady: boolean };
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

export function setDiggingFees(diggingFees: string): EmbalmActions {
  return {
    type: ActionType.SetDiggingFees,
    payload: {
      diggingFees,
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

export function setPublicKeysReady(publicKeysReady: boolean): EmbalmActions {
  return {
    type: ActionType.SetPublicKeysReady,
    payload: {
      publicKeysReady,
    },
  };
}

export function setSignaturesReady(signaturesReady: boolean): EmbalmActions {
  return {
    type: ActionType.SetSignaturesReady,
    payload: {
      signaturesReady,
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

export function setSelectedArchaeologists(archaeologists: Archaeologist[]): EmbalmActions {
  return {
    type: ActionType.SetSelectedArchaeologists,
    payload: {
      archaeologists,
    },
  };
}

export function setRequiredArchaeologists(count: string): EmbalmActions {
  return {
    type: ActionType.SetRequiredArchaeologists,
    payload: {
      count,
    },
  };
}

export function setTotalArchaeologists(count: string): EmbalmActions {
  return {
    type: ActionType.SetTotalArchaeologists,
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

export function setDiggingFeesFilter(filter: string): EmbalmActions {
  return {
    type: ActionType.SetDiggingFeesFilter,
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

export function setArchaeologistSignature(
  peerId: string,
  signature: string
): EmbalmActions {
  return {
    type: ActionType.SetArchaeologistSignature,
    payload: {
      peerId,
      signature,
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

export function setShardPayloadData(shards: ArchaeologistEncryptedShard[], sarcophagusPayloadTxId: string, encryptedShardsTxId: string): EmbalmActions {
  return {
    type: ActionType.SetShardPayloadData,
    payload: {
      shards,
      sarcophagusPayloadTxId,
      encryptedShardsTxId
    },
  };
}

export type EmbalmActions = ActionMap<EmbalmPayload>[keyof ActionMap<EmbalmPayload>];
