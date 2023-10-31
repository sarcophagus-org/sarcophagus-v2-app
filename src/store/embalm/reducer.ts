import { BigNumber, ethers } from 'ethers';
import { CancelCreateToken } from 'features/embalm/stepContent/hooks/useCreateSarcophagus/useCreateSarcophagus';
import { removeFromArray } from 'lib/utils/helpers';
import { Actions } from '..';
import { ActionType, RecipientState } from './actions';
import {
  ArchaeologistData,
  ArchaeologistEncryptedShard,
} from '@sarcophagus-org/sarcophagus-v2-sdk-client';

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
  SelectArchaeologists = 4,
  RequiredArchaeologists = 5,
  CreateSarcophagus = 6,
}

export interface EmbalmState {
  archaeologistEncryptedShards: ArchaeologistEncryptedShard[];
  archaeologists: ArchaeologistData[];
  areStepsDisabled: boolean;
  cancelCreateToken: CancelCreateToken;
  currentChainId: number | undefined;
  currentStep: Step;
  customResurrectionDate: Date | null;
  expandedStepIndices: number[];
  file: File | null;
  isBuyingSarco: boolean;
  name: string;
  outerPrivateKey: string | null;
  outerPublicKey: string | null;
  recipientState: RecipientState;
  requiredArchaeologists: number;
  resurrection: number;
  resurrectionRadioValue: string;
  retryingCreate: boolean;
  sponsorBundlr: boolean;
  selectedArchaeologists: ArchaeologistData[];
  stepStatuses: { [key: number]: StepStatus };
  totalFees: BigNumber;
  uploadPrice: BigNumber;
  sarcoQuoteInterval: NodeJS.Timer | undefined;
}

export const embalmInitialState: EmbalmState = {
  archaeologistEncryptedShards: [],
  archaeologists: [],
  areStepsDisabled: false,
  cancelCreateToken: new CancelCreateToken(),
  currentChainId: undefined,
  currentStep: Step.NameSarcophagus,
  customResurrectionDate: null,
  expandedStepIndices: [Step.NameSarcophagus],
  file: null,
  isBuyingSarco: true,
  name: '',
  outerPrivateKey: null,
  outerPublicKey: null,
  recipientState: { publicKey: '', address: '', setByOption: null },
  requiredArchaeologists: 0,
  resurrection: 0,
  resurrectionRadioValue: '',
  retryingCreate: false,
  sponsorBundlr: false,
  selectedArchaeologists: [],
  stepStatuses: Object.keys(Step).reduce(
    (acc, step) => ({ ...acc, [step]: StepStatus.NotStarted }),
    {}
  ),
  totalFees: ethers.constants.Zero,
  uploadPrice: ethers.constants.Zero,
  sarcoQuoteInterval: undefined,
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
    key: keyof ArchaeologistData;
    value: any;
    updateSelected?: boolean;
  }
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
    const selectedArchaeologistIndex = state.selectedArchaeologists.findIndex(
      a => a.profile.peerId === peerId
    );

    if (selectedArchaeologistIndex !== -1) {
      selectedArchaeologistsCopy[selectedArchaeologistIndex] = {
        ...selectedArchaeologistsCopy[selectedArchaeologistIndex],
        [key]: value,
      };
    }
  }

  return {
    ...state,
    archaeologists: archaeologistsCopy,
    selectedArchaeologists: selectedArchaeologistsCopy,
  };
}

export function embalmReducer(state: EmbalmState, action: Actions): EmbalmState {
  switch (action.type) {
    case ActionType.ToggleSponsorBundlr:
      return { ...state, sponsorBundlr: !state.sponsorBundlr };

    case ActionType.SetSarcoQuoteInterval:
      return { ...state, sarcoQuoteInterval: action.payload.interval };

    case ActionType.ClearSarcoQuoteInterval:
      clearInterval(state.sarcoQuoteInterval);
      return { ...state, sarcoQuoteInterval: undefined };

    case ActionType.GoToStep:
      return { ...state, currentStep: action.payload.step };

    case ActionType.UpdateStepStatus:
      const newStepStatuses = Object.assign({}, state.stepStatuses);
      newStepStatuses[action.payload.step] = action.payload.status;
      return { ...state, stepStatuses: newStepStatuses };

    case ActionType.ToggleStep:
      return toggleStep(state, action.payload.step);

    case ActionType.SetExpandedStepIndices:
      return { ...state, expandedStepIndices: action.payload.indices };

    case ActionType.SetOuterLayerKeys:
      return {
        ...state,
        outerPrivateKey: action.payload.privateKey,
        outerPublicKey: action.payload.publicKey,
      };

    case ActionType.SetSarcophagusName:
      return { ...state, name: action.payload.name };

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
      return { ...state, selectedArchaeologists: action.payload.selectedArchaeologists };

    case ActionType.SetArchaeologistFullPeerId:
      return updateArchProperty(state, action.payload.peerId.toString(), {
        key: 'fullPeerId',
        value: action.payload.peerId,
      });

    case ActionType.SetArchaeologistOnlineStatus:
      return updateArchProperty(state, action.payload.peerId, {
        key: 'isOnline',
        value: action.payload.isOnline,
      });

    case ActionType.SetArchaeologistEnsName:
      return updateArchProperty(state, action.payload.peerId, {
        key: 'ensName',
        value: action.payload.ensName,
        updateSelected: true,
      });

    case ActionType.SetArchaeologistException:
      return updateArchProperty(state, action.payload.peerId, {
        key: 'exception',
        value: action.payload.exception,
        updateSelected: true,
      });

    case ActionType.SetArchaeologistConnection:
      return updateArchProperty(state, action.payload.peerId, {
        key: 'connection',
        value: action.payload.connection,
        updateSelected: true,
      });

    case ActionType.SetArchaeologistPublicKey:
      return updateArchProperty(state, action.payload.peerId.toString(), {
        key: 'publicKey',
        value: action.payload.publicKey,
        updateSelected: true,
      });

    case ActionType.SetArchaeologistSignature:
      return updateArchProperty(state, action.payload.peerId.toString(), {
        key: 'signature',
        value: action.payload.signature,
        updateSelected: true,
      });

    case ActionType.SetCurrentChainId:
      return { ...state, currentChainId: action.payload.chainId };

    case ActionType.DisableSteps:
      return {
        ...state,
        areStepsDisabled: true,
        cancelCreateToken: new CancelCreateToken(),
      };

    case ActionType.EnableSteps:
      return { ...state, areStepsDisabled: false };

    case ActionType.ToggleRetryingCreate:
      return { ...state, retryingCreate: !state.retryingCreate };

    case ActionType.SetCancelToken:
      return { ...state, cancelCreateToken: action.payload.token };

    case ActionType.ResetEmbalmState:
      let initialState = { ...embalmInitialState };
      return {
        ...initialState,
        currentStep: action.payload.step,
        archaeologists: state.archaeologists,
        currentChainId: state.currentChainId,
      };

    case ActionType.SetTotalFees:
      return { ...state, totalFees: action.payload.amount };

    case ActionType.ToggleIsBuyingSarco:
      return { ...state, isBuyingSarco: !state.isBuyingSarco };

    default:
      return state;
  }
}
