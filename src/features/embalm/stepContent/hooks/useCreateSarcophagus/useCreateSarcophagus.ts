import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from '../../../../../store';
import { disableSteps } from 'store/embalm/actions';
import { useArchaeologistSignatureNegotiation } from 'features/embalm/stepContent/hooks/useCreateSarcophagus/useArchaeologistSignatureNegotiation';
import { CreateSarcophagusStage } from '../../utils/createSarcophagus';
import { ethers } from 'ethers';
import { formatCreateSarcophagusError } from '../../utils/errors';
import { useDialArchaeologists } from './useDialArchaeologists';
import { useUploadEncryptedShards } from './useUploadEncryptedShards';
import { useUploadDoubleEncryptedFile } from './useUploadDoubleEncryptedFile';
import { useApproveSarcoToken } from './useApproveSarcoToken';
import { useSubmitSarcophagus } from './useSubmitSarcophagus';
import { CreateSarcophagusContext } from '../../context/CreateSarcophagusContext';

export function useCreateSarcophagus(
  createSarcophagusStages: Record<number, string>,
  embalmerFacet: ethers.Contract,
  sarcoToken: ethers.Contract
) {
  const dispatch = useDispatch();
  const { selectedArchaeologists } = useSelector(x => x.embalmState);

  // State variables to track sarcophagus creation flow across all stages
  const [currentStage, setCurrentStage] = useState(CreateSarcophagusStage.NOT_STARTED);
  const [stageExecuting, setStageExecuting] = useState(false);
  const [stageError, setStageError] = useState<string>();

  // Returns true when all public keys have been received from archaoelogists
  const { publicKeysReady } = useContext(CreateSarcophagusContext);

  // Each hook represents a stage in the create sarcophagus process
  const { dialSelectedArchaeologists } = useDialArchaeologists();
  const { uploadAndSetEncryptedShards } = useUploadEncryptedShards();
  const { initiateSarcophagusNegotiation } = useArchaeologistSignatureNegotiation();
  const { uploadAndSetDoubleEncryptedFile } = useUploadDoubleEncryptedFile();
  const { approveSarcoToken } = useApproveSarcoToken(sarcoToken);
  const { submitSarcophagus } = useSubmitSarcophagus(embalmerFacet);

  const stagesMap = useMemo(() => {
    return new Map<CreateSarcophagusStage, (...args: any[]) => Promise<any>>([
      [CreateSarcophagusStage.DIAL_ARCHAEOLOGISTS, dialSelectedArchaeologists],
      [CreateSarcophagusStage.UPLOAD_ENCRYPTED_SHARDS, uploadAndSetEncryptedShards],
      [CreateSarcophagusStage.ARCHAEOLOGIST_NEGOTIATION, initiateSarcophagusNegotiation],
      [CreateSarcophagusStage.UPLOAD_PAYLOAD, uploadAndSetDoubleEncryptedFile],
      [CreateSarcophagusStage.APPROVE, approveSarcoToken],
      [CreateSarcophagusStage.SUBMIT_SARCOPHAGUS, submitSarcophagus],
    ]);
  }, [
    dialSelectedArchaeologists,
    uploadAndSetEncryptedShards,
    initiateSarcophagusNegotiation,
    uploadAndSetDoubleEncryptedFile,
    approveSarcoToken,
    submitSarcophagus,
  ]);

  // Process each stage as they become active
  useEffect(() => {
    (async () => {
      const incrementStage = (): void => {
        const stages = Object.keys(createSarcophagusStages).map(i => Number.parseInt(i));
        const currentIndex = stages.indexOf(currentStage);
        setCurrentStage(stages[currentIndex + 1]);
      };

      const executeStage = async (stageToExecute: (...args: any[]) => Promise<any>): Promise<any> =>
        new Promise((resolve, reject) => {
          setStageExecuting(true);

          stageToExecute()
            .then((result: any) => {
              setStageExecuting(false);
              incrementStage();
              resolve(result);
            })
            .catch((error: any) => {
              reject(error);
              setStageExecuting(false);
            });
        });

      if (!stageExecuting && !stageError) {
        try {
          if (currentStage === CreateSarcophagusStage.UPLOAD_ENCRYPTED_SHARDS && !publicKeysReady) {
            return;
          }

          const currentStageFunction = stagesMap.get(currentStage);
          if (currentStageFunction) {
            await executeStage(currentStageFunction);
          }
        } catch (error: any) {
          console.error(error);
          const stageErrorMessage = formatCreateSarcophagusError(
            currentStage,
            error,
            selectedArchaeologists
          );
          setStageError(stageErrorMessage);
        }
      }
    })();
  }, [
    currentStage,
    stageExecuting,
    stagesMap,
    stageError,
    dispatch,
    publicKeysReady,
    createSarcophagusStages,
    selectedArchaeologists,
  ]);

  const retryStage = useCallback(async () => {
    setStageError(undefined);
  }, []);

  const handleCreate = useCallback(async () => {
    setCurrentStage(CreateSarcophagusStage.DIAL_ARCHAEOLOGISTS);
    setStageError(undefined);
    dispatch(disableSteps());
  }, [dispatch]);

  return {
    currentStage,
    handleCreate,
    stageError,
    retryStage,
  };
}
