import { useState, useCallback } from 'react';
import {
  setRecipientState,
  RecipientState,
  GeneratePDFState,
  RecipientSetByOption,
} from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import sanitize from 'sanitize-filename';
import { createEncryptionKeypairAsync } from '../useCreateEncryptionKeypair';
import { ethers } from 'ethers';
import { createRecipientKeyDocument } from './recipientKeyDocument';

export function useGenerateRecipientPDF() {
  const dispatch = useDispatch();
  const { name, recipientState } = useSelector(x => x.embalmState);
  const [isLoading, setIsLoading] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const generatePublicKey = useCallback(async () => {
    try {
      setIsLoading(true);
      setGenerateError(null);

      const { privateKey, publicKey } = await createEncryptionKeypairAsync();

      const recipient: RecipientState = {
        address: ethers.utils.computeAddress(publicKey),
        publicKey: publicKey,
        privateKey: privateKey,
        setByOption: RecipientSetByOption.GENERATE,
        generatePDFState: GeneratePDFState.GENERATED,
      };
      dispatch(setRecipientState(recipient));
      setIsLoading(false);
    } catch (_error) {
      dispatch(
        setRecipientState({
          address: '',
          publicKey: '',
          setByOption: RecipientSetByOption.GENERATE,
        })
      );
      const error = _error as Error;
      setGenerateError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const downloadRecipientPDF = useCallback(async () => {
    try {
      setIsLoading(true);
      setGenerateError(null);

      const recipientKeyDocument = await createRecipientKeyDocument(name, recipientState);
      const pdfBlob = await pdf(recipientKeyDocument).toBlob();
      saveAs(pdfBlob, sanitize(name + '-' + recipientState.address.slice(0, 6) + '.pdf'));

      // TODO: need to refactor RecipientState so that we can just set GenerateState without setting the whole recipient
      const newRecipientState: RecipientState = {
        address: recipientState.address,
        publicKey: recipientState.publicKey,
        privateKey: recipientState.privateKey,
        setByOption: recipientState.setByOption,
        generatePDFState: GeneratePDFState.DOWNLOADED,
      };

      dispatch(setRecipientState(newRecipientState));
      return recipientKeyDocument;
    } catch (_error) {
      dispatch(
        setRecipientState({
          address: '',
          publicKey: '',
          setByOption: RecipientSetByOption.GENERATE,
        })
      );
      const error = _error as Error;
      setGenerateError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, name, recipientState]);

  return { isLoading, downloadRecipientPDF, generatePublicKey, generateError };
}
