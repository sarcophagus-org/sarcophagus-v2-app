import { useToast } from '@chakra-ui/react';
import { maxFileSize } from 'lib/constants';
import { fileTooBig, payloadSaveSuccess } from 'lib/utils/toast';
import prettyBytes from 'pretty-bytes';
import { createRef, useState } from 'react';
import { setFile } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';

export function useUploadPayload() {
  const dispatch = useDispatch();
  const { file, uploadPrice } = useSelector(x => x.embalmState);
  const fileInputRef = createRef<HTMLInputElement>();
  const [error, setError] = useState<string | null>('');
  const toast = useToast();

  // Storing the file instead of the payload eliminates the need to save the payload in state
  function handleSetFile(newFile: File | undefined) {
    if (!newFile) return;
    if (newFile.size < maxFileSize) {
      toast(payloadSaveSuccess());
      dispatch(setFile(newFile));
      setError(null);
    } else {
      toast(fileTooBig());
      setError(`File is too big! Your file size must not exceed ${prettyBytes(maxFileSize)}.`);
    }
  }

  return {
    error,
    file,
    fileInputRef,
    handleSetFile,
    uploadPrice,
  };
}
