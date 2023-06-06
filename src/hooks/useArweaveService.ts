import { CancelCreateToken } from 'features/embalm/stepContent/hooks/useCreateSarcophagus/useCreateSarcophagus';
import { useCallback } from 'react';
import { useBundlr } from '../features/embalm/stepContent/hooks/useBundlr';

export enum ArweaveTxStatus {
  PENDING,
  SUCCESS,
  FAIL,
}

export interface ArweaveFileMetadata {
  fileName: string;
  type: string;
}

const useArweaveService = () => {
  const { uploadFile } = useBundlr();

  const uploadToArweave = useCallback(
    (data: Buffer, cancelToken: CancelCreateToken): Promise<string> => {
      return uploadFile(data, cancelToken);
    },
    [uploadFile]
  );

  return {
    uploadToArweave,
  };
};

export default useArweaveService;
