import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from '../../../../../store';
import { ArchaeologistEncryptedShard } from 'types';
import { createEncryptionKeypairAsync } from '../useCreateEncryptionKeypair';
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

export function useCreateSarcophagus(
  createSarcophagusStages: Record<number, string>,
  embalmerFacet: ethers.Contract,
  sarcoToken: ethers.Contract
) {
  const dispatch = useDispatch();

  // State variables to track automated sarcophagus creation flow across all stages
  const [currentStage, setCurrentStage] = useState(CreateSarcophagusStage.NOT_STARTED);
  const [stageExecuting, setStageExecuting] = useState(false);
  const [stageError, setStageError] = useState<string>();

  // Global state from embalm steps, used to create sarcophagus
  const { file, selectedArchaeologists } = useSelector(x => x.embalmState);

  /**
   * Stage 0 - Generate Outer Layer Key Pair
   */
  const [outerPrivateKey, setOuterPrivateKey] = useState('');
  const [outerPublicKey, setOuterPublicKey] = useState('');

  useEffect(() => {
    (async () => {
      const { privateKey, publicKey } = await createEncryptionKeypairAsync();
      setOuterPrivateKey(privateKey);
      setOuterPublicKey(publicKey);
    })();
  }, []);

  /**
   * Stage 1 - Dial Archaeologists
   */
  const [publicKeysReady, setPublicKeysReady] = useState(false);
  const { dialSelectedArchaeologists } = useDialArchaeologists();

  // Archaeologists have callback function on successful dial to send
  // their public keys. When all archs have sent their pub keys, the next stage can begin
  useEffect(() => {
    if (selectedArchaeologists.length > 0) {
      setPublicKeysReady(selectedArchaeologists.every(arch => !!arch.publicKey));
    }
  }, [selectedArchaeologists]);

  /**
   * Stage 2 - Generate + Upload Archaeologist Encrypted Shards to Bundlr
   */
  const [archaeologistShards, setArchaeologistShards] = useState(
    [] as ArchaeologistEncryptedShard[]
  );
  const [encryptedShardsTxId, setEncryptedShardsTxId] = useState('');
  const { uploadAndSetEncryptedShards } = useUploadEncryptedShards(
    outerPrivateKey,
    setArchaeologistShards,
    setEncryptedShardsTxId
  );

  /**
   * Stage 3 - Archaeologist Signature Negotiation
   */
  const [negotiationTimestamp, setNegotiationTimestamp] = useState(0);
  const [archaeologistSignatures, setArchaeologistSignatures] = useState(
    new Map<string, string>([])
  );
  const { initiateSarcophagusNegotiation } = useArchaeologistSignatureNegotiation(
    archaeologistShards,
    encryptedShardsTxId,
    setArchaeologistSignatures,
    setNegotiationTimestamp
  );

  /**
   * Stage 4 - Upload File Payload (double encrypted) to Bundlr
   */
  const [sarcophagusPayloadTxId, setSarcophagusPayloadTxId] = useState('');
  const { uploadAndSetDoubleEncryptedFile } = useUploadDoubleEncryptedFile(
    file,
    outerPublicKey,
    setSarcophagusPayloadTxId
  );

  /**
   * Stage 5a (if necessary) - Approve Sarco Token
   */
  const { approveSarcoToken } = useApproveSarcoToken(sarcoToken);

  /**
   * Stage 5b - Finalize Create Sarcophagus
   */
  const { submitSarcophagus } = useSubmitSarcophagus(
    embalmerFacet,
    negotiationTimestamp,
    archaeologistSignatures,
    archaeologistShards,
    [sarcophagusPayloadTxId, encryptedShardsTxId]
  );

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

      const executeStage = async (
        stageToExecute: (...args: any[]) => Promise<any>,
        ...stageArgs: any[]
      ): Promise<any> =>
        new Promise((resolve, reject) => {
          setStageExecuting(true);

          stageToExecute(...stageArgs)
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

  const handleCreate = useCallback(async () => {
    setCurrentStage(CreateSarcophagusStage.DIAL_ARCHAEOLOGISTS);
    setStageError(undefined);
    dispatch(disableSteps());
  }, [dispatch]);

  // TODO -- re-enable once figure out state issue at end of createSarcophagus
  // const resetLocalEmbalmerState = useCallback(() => {
  //   setArchaeologistShards([] as ArchaeologistEncryptedShard[]);
  //   setEncryptedShardsTxId('');
  //   setSarcophagusPayloadTxId('');
  //   setArchaeologistSignatures(new Map<string, string>([]));
  //   setNegotiationTimestamp(0);
  //   setOuterPrivateKey('');
  //   setOuterPublicKey('');
  // }, []);

  return {
    currentStage,
    uploadAndSetEncryptedShards,
    uploadAndSetDoubleEncryptedFile,
    handleCreate,
    stageError,
    createSarcophagusStages,
  };
}
