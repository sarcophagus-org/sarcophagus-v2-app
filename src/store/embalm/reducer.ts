import { ResurrectionRadioValue } from 'features/embalm/stepContent/steps/Resurrections';
import { removeFromArray } from 'lib/utils/helpers';
import { Archaeologist } from 'types/index';
import { Actions } from '..';
import { ActionType, Recipient, RecipientSetByOption } from './actions';

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
  Resurrections = 5,
  SetDiggingFees = 6,
  TotalRequiredArchaeologists = 7,
  SelectArchaeologists = 8,
  CreateSarcophagus = 9,
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
  recipient: Recipient;
  recipientSetByOption: RecipientSetByOption | undefined;
  requiredArchaeologists: string;
  resurrection: number;
  resurrectionRadioValue: string;
  selectedArchaeologists: Archaeologist[];
  shardsTxId: string;
  stepStatuses: { [key: number]: StepStatus };
  totalArchaeologists: string;
  uploadPrice: string;
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
  recipient: { publicKey: '', address: '' },
  recipientSetByOption: undefined,
  requiredArchaeologists: '0',
  resurrection: 0,
  resurrectionRadioValue: ResurrectionRadioValue.OneWeek,
  selectedArchaeologists: [],
  shardsTxId: '',
  stepStatuses: Object.keys(Step).reduce(
    (acc, step) => ({ ...acc, [step]: StepStatus.NotStarted }),
    {}
  ),
  totalArchaeologists: '0',
  uploadPrice: '',
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

    case ActionType.SetRecipient:
      return {
        ...state,
        recipient: {
          publicKey: action.payload.publicKey,
          address: action.payload.address,
          privateKey: action.payload.privateKey,
        },
      };

    case ActionType.SetRecipientSetByOption:
      return {
        ...state,
        recipientSetByOption: action.payload,
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

    case ActionType.SetPayloadTxId:
      return { ...state, payloadTxId: action.payload.txId };

    case ActionType.SetShardsTxId:
      return { ...state, shardsTxId: action.payload.txId };

    default:
      return state;
  }
}
