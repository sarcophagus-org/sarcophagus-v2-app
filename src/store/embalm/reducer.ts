import { removeFromArray } from 'lib/utils/helpers';
import { Archaeologist, ArchaeologistEncryptedShard } from 'types/index';
import { Actions } from '..';
import { ActionType, RecipientState, SortDirection } from './actions';

export enum StepStatus {
  Complete = 'complete',
  NotStarted = 'not_started',
  Started = 'started',
}

export enum Step {
  NameSarcophagus = 0,
  UploadPayload = 1,
  FundBundlr = 2,
  SetRecipient = 3,
  CreateEncryptionKeypair = 4,
  SetDiggingFees = 5,
  TotalRequiredArchaeologists = 6,
  SelectArchaeologists = 7,
  CreateSarcophagus = 8,
}

export interface EmbalmState {
  archaeologists: Archaeologist[];
  currentStep: Step;
  diggingFees: string;
  expandedStepIndices: number[];
  file: File | null;
  name: string;
  outerPrivateKey: string | null;
  outerPublicKey: string | null;
  payloadTxId: string;
  recipientState: RecipientState;
  requiredArchaeologists: string;
  resurrection: number;
  resurrectionRadioValue: string;
  customResurrectionDate: Date | null;
  selectedArchaeologists: Archaeologist[];
  shardsTxId: string;
  stepStatuses: { [key: number]: StepStatus };
  totalArchaeologists: string;
  uploadPrice: string;
  diggingFeesSortDirection: SortDirection;
  diggingFeesFilter: string;
  archAddressSearch: string;
  archaeologistEncryptedShards: ArchaeologistEncryptedShard[];
  publicKeysReady: boolean;
  signaturesReady: boolean;
  negotiationTimestamp: number;
}

export const embalmInitialState: EmbalmState = {
  archaeologists: [],
  currentStep: Step.NameSarcophagus,
  diggingFees: '0',
  expandedStepIndices: [Step.NameSarcophagus],
  file: null,
  name: '',
  outerPrivateKey: null,
  outerPublicKey: null,
  payloadTxId: '',
  recipientState: { publicKey: '', address: '', setByOption: null },
  requiredArchaeologists: '0',
  resurrection: 0,
  resurrectionRadioValue: '',
  customResurrectionDate: null,
  selectedArchaeologists: [],
  shardsTxId: '',
  stepStatuses: Object.keys(Step).reduce(
    (acc, step) => ({ ...acc, [step]: StepStatus.NotStarted }),
    {}
  ),
  totalArchaeologists: '0',
  uploadPrice: '',
  diggingFeesSortDirection: SortDirection.NONE,
  diggingFeesFilter: '',
  archAddressSearch: '',
  archaeologistEncryptedShards: [],
  publicKeysReady: false,
  signaturesReady: false,
  negotiationTimestamp: 0,
};

function toggleStep(state: EmbalmState, step: Step): EmbalmState {
  const index = step.valueOf();
  const expandedStepIndicesCopy = state.expandedStepIndices.slice();
  if (!expandedStepIndicesCopy.includes(index)) {
    expandedStepIndicesCopy.push(index);
  } else {
    removeFromArray(expandedStepIndicesCopy, index);
  }
  return { ...state, expandedStepIndices: expandedStepIndicesCopy };
}

function updateArchProperty(
  state: EmbalmState,
  peerId: string,
  property: {
    key: keyof Archaeologist,
    value: any,
    updateSelected?: boolean,
  },
): EmbalmState {
  const { key, value, updateSelected } = property;
  const archaeologistIndex = state.archaeologists.findIndex(a => a.profile.peerId === peerId);

  if (archaeologistIndex === -1) return state;

  const archaeologistsCopy = state.archaeologists.slice();
  archaeologistsCopy[archaeologistIndex] = {
    ...archaeologistsCopy[archaeologistIndex],
    [key]: value,
  };

  const selectedArchaeologistsCopy = state.selectedArchaeologists.slice();

  // TODO: Time to merge these two lists maybe?
  if (updateSelected) {
    const selectedArchaeologistIndex = state.selectedArchaeologists.findIndex(a => a.profile.peerId === peerId);

    if (selectedArchaeologistIndex === -1) return state;
    selectedArchaeologistsCopy[selectedArchaeologistIndex] = {
      ...selectedArchaeologistsCopy[selectedArchaeologistIndex],
      [key]: value,
    };
  }

  return {
    ...state,
    archaeologists: archaeologistsCopy,
    selectedArchaeologists: selectedArchaeologistsCopy
  };
}

export function embalmReducer(state: EmbalmState, action: Actions): EmbalmState {
  switch (action.type) {
    case ActionType.GoToStep:
      return { ...state, currentStep: action.payload.step };

    case ActionType.UpdateStepStatus:
      const newStepStatuses = Object.assign({}, state.stepStatuses);
      newStepStatuses[action.payload.step] = action.payload.status;
      return { ...state, stepStatuses: newStepStatuses };

    case ActionType.ToggleStep:
      return toggleStep(state, action.payload.step);

    case ActionType.SetDiggingFees:
      return { ...state, diggingFees: action.payload.diggingFees };

    case ActionType.SetExpandedStepIndices:
      return { ...state, expandedStepIndices: action.payload.indices };

    case ActionType.SetOuterLayerKeys:
      return {
        ...state,
        outerPrivateKey: action.payload.privateKey,
        outerPublicKey: action.payload.publicKey,
      };

    case ActionType.SetName:
      return { ...state, name: action.payload.name };

    case ActionType.SetPublicKeysReady:
      return { ...state, publicKeysReady: action.payload.publicKeysReady };

    case ActionType.SetRecipientState:
      return {
        ...state,
        recipientState: {
          publicKey: action.payload.publicKey,
          address: action.payload.address,
          privateKey: action.payload.privateKey,
          setByOption: action.payload.setByOption,
          generatePDFState: action.payload.generatePDFState,
        },
      };

    case ActionType.SetFile:
      return { ...state, file: action.payload.file };

    case ActionType.SetResurrection:
      return { ...state, resurrection: action.payload.resurrection };

    case ActionType.SetTotalArchaeologists:
      return { ...state, totalArchaeologists: action.payload.count };

    case ActionType.SetRequiredArchaeologists:
      return { ...state, requiredArchaeologists: action.payload.count };

    case ActionType.SetResurrectionRadioValue:
      return { ...state, resurrectionRadioValue: action.payload.value };

    case ActionType.SetCustomResurrectionDate:
      return { ...state, customResurrectionDate: action.payload.date };

    case ActionType.SetUploadPrice:
      return { ...state, uploadPrice: action.payload.price };

    case ActionType.SetArchaeologists:
      return { ...state, archaeologists: action.payload.archaeologists };

    case ActionType.SelectArchaeologist:
      return {
        ...state,
        selectedArchaeologists: [...state.selectedArchaeologists, action.payload.archaeologist],
      };

    case ActionType.DeselectArchaeologist:
      return {
        ...state,
        selectedArchaeologists: state.selectedArchaeologists.filter(
          a => a.profile.archAddress !== action.payload.address
        ),
      };

    case ActionType.SetSelectedArchaeologists:
      return { ...state, selectedArchaeologists: action.payload.archaeologists };

    case ActionType.SetDiggingFeesSortDirection:
      return { ...state, diggingFeesSortDirection: action.payload.direction };

    case ActionType.SetDiggingFeesFilter:
      return { ...state, diggingFeesFilter: action.payload.filter };

    case ActionType.SetArchAddressSearch:
      return { ...state, archAddressSearch: action.payload.search };

    case ActionType.SetArchaeologistFullPeerId:
      return updateArchProperty(
        state,
        action.payload.peerId.toString(), {
        key: 'fullPeerId',
        value: action.payload.peerId
      });

    case ActionType.SetArchaeologistOnlineStatus:
      return updateArchProperty(
        state,
        action.payload.peerId, {
        key: 'isOnline',
        value: action.payload.isOnline
      });

    case ActionType.SetArchaeologistConnection:
      return updateArchProperty(
        state,
        action.payload.peerId, {
        key: 'connection',
        value: action.payload.connection,
        updateSelected: true,
      });

    case ActionType.SetArchaeologistSignature:
      return updateArchProperty(
        state,
        action.payload.peerId, {
        key: 'signature',
        value: action.payload.signature,
        updateSelected: true,
      });

    case ActionType.SetPublicKeysReady:
      return { ...state, publicKeysReady: action.payload.publicKeysReady };

    case ActionType.SetSignaturesReady:
      return { ...state, signaturesReady: action.payload.signaturesReady };

    case ActionType.SetNegotiationTimestamp:
      return { ...state, negotiationTimestamp: action.payload.negotiationTimestamp };

    case ActionType.SetArchaeologistPublicKey:
      return updateArchProperty(
        state,
        action.payload.peerId.toString(), {
        key: 'publicKey',
        value: action.payload.publicKey,
        updateSelected: true,
      });

    case ActionType.SetShardPayloadData:
      const { shards, encryptedShardsTxId, sarcophagusPayloadTxId } = action.payload;

      return {
        ...state,
        archaeologistEncryptedShards: shards,
        shardsTxId: encryptedShardsTxId,
        payloadTxId: sarcophagusPayloadTxId,
      };

    case ActionType.ResetEmbalmState:
      return embalmInitialState;

    default:
      return state;
  }
}
