import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../../../../store';
import { ArchaeologistEncryptedShard } from 'types';
import { createEncryptionKeypairAsync } from '../useCreateEncryptionKeypair';
import { disableSteps } from 'store/embalm/actions';
import { useArchaeologistSignatureNegotiation } from 'features/embalm/stepContent/hooks/useCreateSarcophagus/useArchaeologistSignatureNegotiation';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  // State variables to track automated sarcophagus creation flow across `CreateSarcophagusStage`s
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
  const { dialSelectedArchaeologists } = useDialArchaeologists();
  const [publicKeysReady, setPublicKeysReady] = useState(false);

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
  const [signaturesReady, setSignaturesReady] = useState(false);
  const { initiateSarcophagusNegotiation } = useArchaeologistSignatureNegotiation();

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

      // TODO: If `stageError` is never reset when after an exception, only a refresh will unblock this flow. Remember to reset it if error can be resolved safely
      if (!stageExecuting && !stageError) {
        try {
          switch (currentStage) {
            case CreateSarcophagusStage.DIAL_ARCHAEOLOGISTS:
              await executeStage(dialSelectedArchaeologists);
              break;

            case CreateSarcophagusStage.UPLOAD_ENCRYPTED_SHARDS:
              if (publicKeysReady) {
                await executeStage(uploadAndSetEncryptedShards);
              }
              break;

            case CreateSarcophagusStage.ARCHAEOLOGIST_NEGOTIATION:
              await executeStage(
                initiateSarcophagusNegotiation,
                archaeologistShards,
                encryptedShardsTxId,
                setArchaeologistSignatures,
                setNegotiationTimestamp
              );
              break;

            case CreateSarcophagusStage.UPLOAD_PAYLOAD:
              if (signaturesReady) {
                await executeStage(uploadAndSetDoubleEncryptedFile);
              }
              break;

            case CreateSarcophagusStage.APPROVE:
              await executeStage(approveSarcoToken);
              break;

            case CreateSarcophagusStage.SUBMIT_SARCOPHAGUS:
              await executeStage(submitSarcophagus);
              break;

            case CreateSarcophagusStage.COMPLETED:
              setTimeout(() => {
                // TODO: reset state -- having some issues with this
                // resetLocalEmbalmerState();
                // dispatch(resetEmbalmState());
                // dispatch(enableSteps());
                navigate('/dashboard');
              }, 4000);
              break;
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
    publicKeysReady,
    signaturesReady,
    archaeologistShards,
    encryptedShardsTxId,
    setArchaeologistSignatures,
    uploadAndSetEncryptedShards,
    createSarcophagusStages,
    initiateSarcophagusNegotiation,
    uploadAndSetDoubleEncryptedFile,
    approveSarcoToken,
    dialSelectedArchaeologists,
    submitSarcophagus,
    selectedArchaeologists,
    stageError,
    dispatch,
    navigate,
  ]);

  // Update archaeologist public keys, signatures ready status
  useEffect(() => {
    if (selectedArchaeologists.length > 0) {
      let allPublicKeysReady = true;
      let allSignaturesReady = true;

      selectedArchaeologists.forEach(arch => {
        if (!arch.publicKey) allPublicKeysReady = false;
        if (!arch.signature) allSignaturesReady = false;
      });

      setPublicKeysReady(allPublicKeysReady);
      setSignaturesReady(allSignaturesReady);
    }
  }, [selectedArchaeologists]);

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
