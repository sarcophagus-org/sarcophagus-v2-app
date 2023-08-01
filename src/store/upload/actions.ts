import { ActionMap } from '../ActionMap';

// NOTE: Prefix each action with this namespace. Duplicate action names in other reducers will cause
// unexpected behavior.
export enum ActionType {
  SetIsUploading = 'UPLOAD_SET_IS_UPLOADING',
  SetUploadProgress = 'UPLOAD_SET_UPLOAD_PROGRESS',
  SetTxId = 'UPLOAD_SET_TX_ID',
}

type UploadPayload = {
  [ActionType.SetIsUploading]: { isUploading: boolean };
  [ActionType.SetUploadProgress]: { uploadProgress: number };
  [ActionType.SetTxId]: { txId: string };
};

export function setIsUploading(isUploading: boolean): UploadActions {
  return {
    type: ActionType.SetIsUploading,
    payload: {
      isUploading,
    },
  };
}
export function setUploadProgress(uploadProgress: number): UploadActions {
  return {
    type: ActionType.SetUploadProgress,
    payload: {
      uploadProgress,
    },
  };
}

export type UploadActions = ActionMap<UploadPayload>[keyof ActionMap<UploadPayload>];
