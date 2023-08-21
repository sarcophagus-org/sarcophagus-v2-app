import { ActionMap } from '../ActionMap';
import { Step, StepStatus } from './reducer';
import { PeerId } from '@libp2p/interface-peer-id';
import { Connection } from '@libp2p/interface-connection';
import { BigNumber } from 'ethers';
import { CancelCreateToken } from 'features/embalm/stepContent/hooks/useCreateSarcophagus/useCreateSarcophagus';
import {
  ArchaeologistData,
  ArchaeologistException,
} from '@sarcophagus-org/sarcophagus-v2-sdk-client';

// NOTE: Prefix each action with this namespace. Duplicate action names in other reducers will cause
// unexpected behavior.
export enum ActionType {
  ToggleSponsorBundlr = 'EMBALM_TOGGLE_SPONSOR_BUNDLR',
  SetSarcoQuoteInterval = 'EMBALM_SET_SARCO_QUOTE_INTERVAL',
  ClearSarcoQuoteInterval = 'EMBALM_CLEAR_SARCO_QUOTE_INTERVAL',
  DeselectArchaeologist = 'EMBALM_DESELECT_ARCHAEOLOGIST',
  DisableSteps = 'EMBALM_DISABLE_STEPS',
  EnableSteps = 'EMBALM_ENABLE_STEPS',
  GoToStep = 'EMBALM_GO_TO_STEP',
  ResetEmbalmState = 'EMBALM_RESET_EMBALM_STATE',
  SelectArchaeologist = 'EMBALM_SELECT_ARCHAEOLOGIST',
  SetArchaeologistConnection = 'EMBALM_SET_ARCHAEOLOGIST_CONNECTION',
  SetArchaeologistEnsName = 'EMBALM_SET_ARCHAEOLOGIST_ENS_NAME',
  SetArchaeologistException = 'EMBALM_SET_ARCHAEOLOGIST_EXCEPTION',
  SetArchaeologistFullPeerId = 'EMBALM_SET_ARCHAEOLOGIST_FULL_PEER_ID',
  SetArchaeologistOnlineStatus = 'EMBALM_SET_ARCHAEOLOGIST_ONLINE_STATUS',
  SetArchaeologistPublicKey = 'EMBALM_SET_ARCHAEOLOGIST_PUBLIC_KEY',
  SetArchaeologists = 'EMBALM_SET_ARCHAEOLOGISTS',
  SetArchaeologistSignature = 'EMBALM_SET_ARCHAEOLOGIST_SIGNATURE',
  SetCancelToken = 'EMBALM_SET_CANCEL_TOKEN',
  SetCurrentChainId = 'EMBALM_SET_CURRENT_CHAIN_ID',
  SetCustomResurrectionDate = 'EMBALM_SET_CUSTOM_RESURRECTION_DATE',
  SetExpandedStepIndices = 'EMBALM_SET_EXPANDED_STEP_INDICES',
  SetFile = 'EMBALM_SET_FILE',
  SetNegotiationTimestamp = 'EMBALM_SET_NEGOTIATION_TIMESTAMP',
  SetOuterLayerKeys = 'EMBALM_SET_OUTER_LAYER_KEYS',
  SetRecipientState = 'EMBALM_SET_RECIPIENT_STATE',
  SetRequiredArchaeologists = 'EMBALM_SET_REQUIRED_ARCHAEOLOGISTS',
  SetResurrection = 'EMBALM_SET_RESURRECTION',
  SetResurrectionRadioValue = 'EMBALM_SET_RESURRECTION_RADIO_VALUE',
  SetSarcophagusName = 'EMBALM_SET_SARCOPHAGUS_NAME',
  SetSelectedArchaeologists = 'EMBALM_SET_SELECTED_ARCHAEOLOGISTS',
  SetTotalFees = 'EMBALM_SET_TOTAL_FEES',
  SetUploadPrice = 'EMBALM_SET_UPLOAD_PRICE',
  ToggleIsBuyingSarco = 'EMBALM_TOGGLE_IS_BUYING_SARCO',
  ToggleRetryingCreate = 'EMBALM_TOGGLE_RETRYING_CREATE',
  ToggleStep = 'EMBALM_TOGGLE_STEP',
  UpdateStepStatus = 'EMBALM_UPDATE_STEP_STATUS',
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
  [ActionType.SetSarcoQuoteInterval]: { interval: NodeJS.Timer };
  [ActionType.ClearSarcoQuoteInterval]: {};
  [ActionType.DisableSteps]: {};
  [ActionType.EnableSteps]: {};
  [ActionType.ToggleSponsorBundlr]: {};
  [ActionType.GoToStep]: { step: Step };
  [ActionType.ResetEmbalmState]: { step: Step };
  [ActionType.ResetEmbalmState]: { step: Step };
  [ActionType.SelectArchaeologist]: { archaeologist: ArchaeologistData };
  [ActionType.SetArchaeologistConnection]: { peerId: string; connection: Connection | undefined };
  [ActionType.SetArchaeologistEnsName]: { peerId: string; ensName: string };
  [ActionType.SetArchaeologistException]: { peerId: string; exception: ArchaeologistException };
  [ActionType.SetArchaeologistFullPeerId]: { peerId: PeerId };
  [ActionType.SetArchaeologistOnlineStatus]: { peerId: string; isOnline: boolean };
  [ActionType.SetArchaeologistPublicKey]: { peerId: string; publicKey: string };
  [ActionType.SetArchaeologists]: { archaeologists: ArchaeologistData[] };
  [ActionType.SetArchaeologistSignature]: { peerId: string; signature: string };
  [ActionType.SetCancelToken]: { token: CancelCreateToken };
  [ActionType.SetCurrentChainId]: { chainId: number | undefined };
  [ActionType.SetCustomResurrectionDate]: { date: Date | null };
  [ActionType.SetExpandedStepIndices]: { indices: number[] };
  [ActionType.SetFile]: { file: File };
  [ActionType.SetNegotiationTimestamp]: { negotiationTimestamp: number };
  [ActionType.SetOuterLayerKeys]: { privateKey: string; publicKey: string };
  [ActionType.SetRecipientState]: RecipientState;
  [ActionType.SetRequiredArchaeologists]: { count: number };
  [ActionType.SetResurrection]: { resurrection: number };
  [ActionType.SetResurrectionRadioValue]: { value: string };
  [ActionType.SetSarcophagusName]: { name: string };
  [ActionType.SetSelectedArchaeologists]: { selectedArchaeologists: ArchaeologistData[] };
  [ActionType.SetTotalFees]: { amount: BigNumber };
  [ActionType.SetUploadPrice]: { price: BigNumber };
  [ActionType.ToggleRetryingCreate]: {};
  [ActionType.ToggleStep]: { step: Step };
  [ActionType.UpdateStepStatus]: { step: Step; status: StepStatus };
  [ActionType.ToggleIsBuyingSarco]: {};
};

export function goToStep(step: Step): EmbalmActions {
  return {
    type: ActionType.GoToStep,
    payload: {
      step,
    },
  };
}

export function setArchaeologists(archaeologists: ArchaeologistData[]): EmbalmActions {
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

export function toggleSponsorBundlr(): EmbalmActions {
  return {
    type: ActionType.ToggleSponsorBundlr,
    payload: {},
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

export function setSarcophagusName(name: string): EmbalmActions {
  return {
    type: ActionType.SetSarcophagusName,
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

export function setUploadPrice(price: BigNumber): EmbalmActions {
  return {
    type: ActionType.SetUploadPrice,
    payload: {
      price,
    },
  };
}

export function selectArchaeologist(archaeologist: ArchaeologistData): EmbalmActions {
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

export function setSarcoQuoteInterval(interval: NodeJS.Timer): EmbalmActions {
  return {
    type: ActionType.SetSarcoQuoteInterval,
    payload: {
      interval,
    },
  };
}

export function clearSarcoQuoteInterval(): EmbalmActions {
  return {
    type: ActionType.ClearSarcoQuoteInterval,
    payload: {},
  };
}

export function setSelectedArchaeologists(archaeologists: ArchaeologistData[]): EmbalmActions {
  return {
    type: ActionType.SetSelectedArchaeologists,
    payload: {
      selectedArchaeologists: archaeologists,
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

export function setArchaeologistEnsName(peerId: string, ensName: string): EmbalmActions {
  return {
    type: ActionType.SetArchaeologistEnsName,
    payload: {
      peerId,
      ensName,
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

export function resetEmbalmState(step: Step = Step.NameSarcophagus): EmbalmActions {
  return {
    type: ActionType.ResetEmbalmState,
    payload: {
      step,
    },
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

export function toggleRetryingCreate(): EmbalmActions {
  return {
    type: ActionType.ToggleRetryingCreate,
    payload: {},
  };
}

export function setCancelToken(token: CancelCreateToken): EmbalmActions {
  return {
    type: ActionType.SetCancelToken,
    payload: { token },
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

export function setTotalFees(amount: BigNumber): EmbalmActions {
  return {
    type: ActionType.SetTotalFees,
    payload: {
      amount,
    },
  };
}

export function toggleIsBuyingSarco(): EmbalmActions {
  return {
    type: ActionType.ToggleIsBuyingSarco,
    payload: {},
  };
}

export type EmbalmActions = ActionMap<EmbalmPayload>[keyof ActionMap<EmbalmPayload>];
