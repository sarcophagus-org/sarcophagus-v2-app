import { BigNumber } from 'ethers';
import { useArchaeologistSignatureNegotiation } from 'features/embalm/stepContent/hooks/useCreateSarcophagus/useArchaeologistSignatureNegotiation';
import { useApprove } from 'hooks/sarcoToken/useApprove';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { disableSteps, toggleRetryingCreate } from 'store/embalm/actions';
import { useDispatch, useSelector } from '../../../../../store';
import { CreateSarcophagusStage } from '../../utils/createSarcophagus';
import { formatCreateSarcophagusError } from '../../utils/errors';
import { useBuySarco } from './useBuySarco';
import { useClearSarcophagusState } from './useClearSarcophagusState';
import { useDialArchaeologists } from './useDialArchaeologists';
import { useSubmitSarcophagus } from './useSubmitSarcophagus';
import { useUploadFileAndKeyShares } from './useUploadFileAndKeyShares';
import { useNetwork } from 'wagmi';

export class CancelCreateToken {
  cancelled: boolean;

  constructor() {
    this.cancelled = false;
  }

  cancel() {
    this.cancelled = true;
  }
}

export function useCreateSarcophagus(
  createSarcophagusStages: Record<number, string>,
  approveAmount: BigNumber
) {
  const dispatch = useDispatch();
  const { chain } = useNetwork();
  const { selectedArchaeologists, cancelCreateToken } = useSelector(x => x.embalmState);

  // State variables to track sarcophagus creation flow across all stages
  const [currentStage, setCurrentStage] = useState(CreateSarcophagusStage.NOT_STARTED);
  const [stageExecuting, setStageExecuting] = useState(false);
  const [stageError, setStageError] = useState<string>();
  const [stageInfo, setStageInfo] = useState<string>();
  const [isStageRetry, setIsStageRetry] = useState(false);

  // Each hook represents a stage in the create sarcophagus process
  const { dialSelectedArchaeologists } = useDialArchaeologists();
  const { initiateSarcophagusNegotiation } = useArchaeologistSignatureNegotiation();
  const { uploadAndSetArweavePayload, uploadStep } = useUploadFileAndKeyShares();
  const { buySarco } = useBuySarco(chain?.id);
  const { approve: approveSarcoToken } = useApprove({ amount: approveAmount });
  const { submitSarcophagus } = useSubmitSarcophagus();
  const { clearSarcophagusState, successData } = useClearSarcophagusState();

  const stageInfoMap = useMemo(() => {
    return new Map<CreateSarcophagusStage, string>([
      [CreateSarcophagusStage.DIAL_ARCHAEOLOGISTS, ''],
      [CreateSarcophagusStage.ARCHAEOLOGIST_NEGOTIATION, ''],
      [CreateSarcophagusStage.UPLOAD_PAYLOAD, uploadStep],
      [CreateSarcophagusStage.BUY_SARCO, 'Waiting for transaction'],
      [CreateSarcophagusStage.APPROVE, 'Waiting for transaction'],
      [CreateSarcophagusStage.SUBMIT_SARCOPHAGUS, 'Waiting for transaction'],
      [CreateSarcophagusStage.CLEAR_STATE, ''],
      [CreateSarcophagusStage.COMPLETED, ''],
    ]);
  }, [uploadStep]);

  useEffect(() => {
    setStageInfo(stageInfoMap.get(currentStage));
  }, [currentStage, stageInfoMap]);

  const stagesMap = useMemo(() => {
    return new Map<CreateSarcophagusStage, (...args: any[]) => Promise<any>>([
      [CreateSarcophagusStage.DIAL_ARCHAEOLOGISTS, dialSelectedArchaeologists],
      [CreateSarcophagusStage.ARCHAEOLOGIST_NEGOTIATION, initiateSarcophagusNegotiation],
      [CreateSarcophagusStage.BUY_SARCO, buySarco],
      [CreateSarcophagusStage.UPLOAD_PAYLOAD, uploadAndSetArweavePayload],
      [CreateSarcophagusStage.APPROVE, approveSarcoToken],
      [CreateSarcophagusStage.SUBMIT_SARCOPHAGUS, submitSarcophagus],
      [CreateSarcophagusStage.CLEAR_STATE, clearSarcophagusState],
      [CreateSarcophagusStage.COMPLETED, async () => {}],
    ]);
  }, [
    dialSelectedArchaeologists,
    initiateSarcophagusNegotiation,
    uploadAndSetArweavePayload,
    buySarco,
    approveSarcoToken,
    submitSarcophagus,
    clearSarcophagusState,
  ]);

  // Process each stage as they become active
  useEffect(() => {
    (async () => {
      const incrementStage = (): void => {
        if (currentStage === CreateSarcophagusStage.COMPLETED) {
          return;
        }
        const stages = Object.keys(createSarcophagusStages).map(i => Number.parseInt(i));
        const currentIndex = stages.indexOf(currentStage);
        setCurrentStage(stages[currentIndex + 1]);
      };

      const executeStage = async (
        stageToExecute: (_: boolean, __: CancelCreateToken) => Promise<any>,
        isRetry: boolean,
        cancelToken: CancelCreateToken
      ): Promise<any> =>
        new Promise((resolve, reject) => {
          setStageExecuting(true);
          stageToExecute(isRetry, cancelToken)
            .then((result: any) => {
              // Add a slight delay before next step
              // to account for any global dispatch delay
              setTimeout(() => {
                setStageExecuting(false);
                setIsStageRetry(false);
                incrementStage();
                resolve(result);
              }, 1000);
            })
            .catch((error: any) => {
              reject(error);
              setStageExecuting(false);
              setIsStageRetry(false);
            });
        });

      const didConnectionDrop = (error: any): boolean => {
        return (
          currentStage === CreateSarcophagusStage.ARCHAEOLOGIST_NEGOTIATION &&
          error.message &&
          error.message.includes('connection is closed')
        );
      };
      const retryDialStage = async () => {
        console.log('dial dropped during negotiation, retrying dial stage');
        setCurrentStage(CreateSarcophagusStage.DIAL_ARCHAEOLOGISTS);
        setStageError(undefined);
        setIsStageRetry(true);
      };
      const handleStageError = async (error: any) => {
        // If archaeologist connection drops during negotiation step,
        // Re-try dialing step
        if (didConnectionDrop(error)) {
          await retryDialStage();
        } else {
          const stageErrorMessage = formatCreateSarcophagusError(
            currentStage,
            error,
            selectedArchaeologists
          );
          setStageError(stageErrorMessage);
        }
      };

      if (!stageExecuting && !stageError && currentStage !== CreateSarcophagusStage.COMPLETED) {
        try {
          const currentStageFunction = stagesMap.get(currentStage);
          if (currentStageFunction) {
            await executeStage(currentStageFunction, isStageRetry, cancelCreateToken);
          }
        } catch (error: any) {
          await handleStageError(error);
        }
      }
    })();
  }, [
    cancelCreateToken,
    currentStage,
    stageExecuting,
    stagesMap,
    stageError,
    isStageRetry,
    dispatch,
    createSarcophagusStages,
    selectedArchaeologists,
  ]);

  const retryStage = useCallback(async () => {
    setStageError(undefined);
    setIsStageRetry(true);

    if (currentStage === CreateSarcophagusStage.SUBMIT_SARCOPHAGUS) {
      dispatch(toggleRetryingCreate());
    }
  }, [currentStage, dispatch]);

  const retryCreateSarcophagus = useCallback(async () => {
    setStageError(undefined);
    setIsStageRetry(false);

    if (currentStage === CreateSarcophagusStage.SUBMIT_SARCOPHAGUS) {
      setCurrentStage(CreateSarcophagusStage.ARCHAEOLOGIST_NEGOTIATION);
    }
  }, [currentStage]);

  const handleCreate = useCallback(async () => {
    setCurrentStage(CreateSarcophagusStage.DIAL_ARCHAEOLOGISTS);
    setStageError(undefined);
    setIsStageRetry(false);
    dispatch(disableSteps());
  }, [dispatch]);

  return {
    currentStage,
    handleCreate,
    stageError,
    stageInfo,
    retryStage,
    retryCreateSarcophagus,
    successData,
    clearSarcophagusState,
  };
}
