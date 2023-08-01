import { Actions } from '..';
import { ActionType } from './actions';

export interface UploadState {
  isUploading: boolean;
  uploadProgress: number;
  txId: string | null;
}

export const uploadInitialState: UploadState = {
  isUploading: false,
  uploadProgress: 0,
  txId: null,
};

export function uploadReducer(state: UploadState, action: Actions): UploadState {
  switch (action.type) {
    case ActionType.SetIsUploading:
      return { ...state, isUploading: action.payload.isUploading };

    case ActionType.SetUploadProgress:
      return { ...state, uploadProgress: action.payload.uploadProgress };

    case ActionType.SetTxId:
      const txId = action.payload.txId;
      return { ...state, txId };

    default:
      return state;
  }
}
