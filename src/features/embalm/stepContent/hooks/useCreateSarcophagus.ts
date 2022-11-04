import { encrypt, readFileDataAsBase64 } from 'lib/utils/helpers';
import { useCallback, useEffect, useState } from 'react';
import { split } from 'shamirs-secret-sharing-ts';
import { useDispatch, useSelector } from 'store/index';
import { formatSubmitSarcophagusArgs } from 'hooks/embalmerFacet';
import { ArchaeologistEncryptedShard } from 'types';
import useArweaveService from 'hooks/useArweaveService';
import { createEncryptionKeypairAsync } from './useCreateEncryptionKeypair';
import { useBundlr } from './useBundlr';
import { disableSteps } from 'store/embalm/actions';
import { useSarcophagusNegotiation } from 'hooks/useSarcophagusNegotiation';
import { useNavigate } from 'react-router-dom';
import { useNetworkConfig } from 'lib/config';
import { hardhatChainId } from 'lib/config/hardhat';
import { CreateSarcophagusStage, encryptShards } from '../utils/createSarcophagus';
import { ethers } from 'ethers';
import { formatCreateSarcophagusError } from '../utils/errors';

export function useCreateSarcophagus(
  createSarcophagusStages: Record<number, string>,
  embalmerFacet: ethers.Contract,
  sarcoToken: ethers.Contract
) {
  const dispatch = useDispatch();

  const {
    name,
    recipientState,
    resurrection,
    file,
    selectedArchaeologists,
    requiredArchaeologists,
  } = useSelector(x => x.embalmState);

  const navigate = useNavigate();

  // BUNDLR config
  const { uploadFile } = useBundlr();
  const { uploadArweaveFile } = useArweaveService();

  const { dialSelectedArchaeologists, initiateSarcophagusNegotiation } =
    useSarcophagusNegotiation();

  const networkConfig = useNetworkConfig();

  // State variables to track automated sarcophagus creation flow across `CreateSarcophagusStage`s
  const [currentStage, setCurrentStage] = useState(CreateSarcophagusStage.NOT_STARTED);
  const [stageExecuting, setStageExecuting] = useState(false);
  const [publicKeysReady, setPublicKeysReady] = useState(false);
  const [signaturesReady, setSignaturesReady] = useState(false);
  const [stageError, setStageError] = useState<string>();

  // State variables needed for final submit stage
  const [archaeologistShards, setArchaeologistShards] = useState(
    [] as ArchaeologistEncryptedShard[]
  );
  const [encryptedShardsTxId, setEncryptedShardsTxId] = useState('');
  const [sarcophagusPayloadTxId, setSarcophagusPayloadTxId] = useState('');
  const [archaeologistSignatures, setArchaeologistSignatures] = useState(
    new Map<string, string>([])
  );
  const [negotiationTimestamp, setNegotiationTimestamp] = useState(0);
  const [outerPrivateKey, setOuterPrivateKey] = useState('');
  const [outerPublicKey, setOuterPublicKey] = useState('');

  // Generates a random key with which to encrypt the outer layer of the sarcophagus
  useEffect(() => {
    (async () => {
      const { privateKey, publicKey } = await createEncryptionKeypairAsync();
      setOuterPrivateKey(privateKey);
      setOuterPublicKey(publicKey);
    })();
  }, []);

  const uploadToArweave = useCallback(
    async (data: Buffer): Promise<string> => {
      const txId =
        networkConfig.chainId === hardhatChainId
          ? await uploadArweaveFile(data)
          : await uploadFile(data);

      return txId;
    },
    [uploadArweaveFile, uploadFile, networkConfig.chainId]
  );

  const processUploadToArweaveError = (error: any) => {
    // TODO: need to determine if `error` is bundlr error, process accordingly
    // We may want to have the user sign out / sign back in from Bundlr
    // before retrying an upload
    throw new Error(error.message || 'Error uploading to Bundlr');
  };

  const uploadAndSetEncryptedShards = useCallback(async () => {
    try {
      // Step 1: Split the outer layer private key using shamirs secret sharing
      const shards: Uint8Array[] = split(outerPrivateKey, {
        shares: selectedArchaeologists.length,
        threshold: requiredArchaeologists,
      });

      // Step 2: Encrypt each shard of the outer layer private key using each archaeologist's public
      // key
      const archPublicKeys = selectedArchaeologists.map(x => x.publicKey!);
      const encShards = await encryptShards(archPublicKeys, shards);

      // Step 3: Create a mapping of arch public keys -> encrypted shards; upload to arweave
      const mapping: Record<string, string> = encShards.reduce(
        (acc, shard) => ({
          ...acc,
          [shard.publicKey]: shard.encryptedShard,
        }),
        {}
      );

      const txId = await uploadToArweave(Buffer.from(JSON.stringify(mapping)));

      setArchaeologistShards(encShards);
      setEncryptedShardsTxId(txId);
    } catch (error: any) {
      processUploadToArweaveError(error);
    }
  }, [requiredArchaeologists, outerPrivateKey, selectedArchaeologists, uploadToArweave]);

  const uploadAndSetDoubleEncryptedFile = useCallback(async () => {
    try {
      const payload = await readFileDataAsBase64(file!);

      // Step 1: Encrypt the inner layer
      const encryptedInnerLayer = await encrypt(recipientState.publicKey, payload);

      // Step 2: Encrypt the outer layer
      const encryptedOuterLayer = await encrypt(outerPublicKey!, encryptedInnerLayer);

      // Step 3: Upload the double encrypted payload to arweave
      const payloadTxId = await uploadToArweave(encryptedOuterLayer);

      setSarcophagusPayloadTxId(payloadTxId);
    } catch (error) {
      processUploadToArweaveError(error);
    }
  }, [file, outerPublicKey, recipientState.publicKey, uploadToArweave, setSarcophagusPayloadTxId]);

  const approveSarcoToken = useCallback(async () => {
    const tx = await sarcoToken.approve(
      networkConfig.diamondDeployAddress,
      ethers.constants.MaxUint256
    );

    await tx.wait();
  }, [sarcoToken, networkConfig.diamondDeployAddress]);

  const submitSarcophagus = useCallback(async () => {
    const arweaveTxIds = [sarcophagusPayloadTxId, encryptedShardsTxId];

    const { submitSarcophagusArgs } = formatSubmitSarcophagusArgs({
      name,
      recipientState,
      resurrection,
      selectedArchaeologists,
      requiredArchaeologists,
      negotiationTimestamp,
      archaeologistSignatures,
      archaeologistShards,
      arweaveTxIds,
    });

    const tx = await embalmerFacet.createSarcophagus(...submitSarcophagusArgs);

    await tx.wait();
  }, [
    embalmerFacet,
    name,
    recipientState,
    encryptedShardsTxId,
    sarcophagusPayloadTxId,
    resurrection,
    selectedArchaeologists,
    requiredArchaeologists,
    negotiationTimestamp,
    archaeologistSignatures,
    archaeologistShards,
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

              // Set current stage to next stage
              incrementStage();
              resolve(result);
            })
            .catch((error: any) => {
              console.log('stage error', error);
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
        } catch (e: any) {
          console.error(e);
          const stageErrorMessage = formatCreateSarcophagusError(
            currentStage,
            e,
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
