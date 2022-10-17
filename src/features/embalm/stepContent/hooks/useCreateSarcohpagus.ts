import { ethers } from 'ethers';
import { doubleHashShard, encrypt, readFileDataAsBase64 } from 'lib/utils/helpers';
import { useCallback, useEffect, useState } from 'react';
import { split } from 'shamirs-secret-sharing-ts';
import { setIsUploading } from 'store/bundlr/actions';
import { setSarcophagusPayloadTxId, setShardPayloadData } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
// import { useBundlr } from './useBundlr';
import { useSubmitSarcophagus } from 'hooks/embalmerFacet';
import { ArchaeologistEncryptedShard } from 'types';
import useArweaveService from 'hooks/useArweaveService';
import { useSarcophagusNegotiation } from '../../../../hooks/useSarcophagusNegotiation';

export enum CreateSarcophagusStep {
  NOT_STARTED,
  DIAL_ARCHAEOLOGISTS,
  UPLOAD_ENCRYPTED_SHARDS,
  ARCHAEOLOGIST_NEGOTIATION,
  UPLOAD_PAYLOAD,
  SUBMIT_SARCOPHAGUS,
  COMPLETED
}

const createSarcophagusSteps = [
  CreateSarcophagusStep.NOT_STARTED,
  CreateSarcophagusStep.DIAL_ARCHAEOLOGISTS,
  CreateSarcophagusStep.UPLOAD_ENCRYPTED_SHARDS,
  CreateSarcophagusStep.ARCHAEOLOGIST_NEGOTIATION,
  CreateSarcophagusStep.UPLOAD_PAYLOAD,
  CreateSarcophagusStep.SUBMIT_SARCOPHAGUS,
  CreateSarcophagusStep.COMPLETED
];

async function encryptShards(
  publicKeys: string[],
  payload: Uint8Array[]
): Promise<ArchaeologistEncryptedShard[]> {
  return Promise.all(
    publicKeys.map(async (publicKey, i) => ({
      publicKey,
      encryptedShard: ethers.utils.hexlify(await encrypt(publicKey, Buffer.from(payload[i]))),
      unencryptedShardDoubleHash: doubleHashShard(payload[i])
    }))
  );
}

export function useCreateSarcophagus() {
  const dispatch = useDispatch();
  const {
    recipientState,
    file,
    outerPublicKey,
    outerPrivateKey,
    selectedArchaeologists,
    payloadTxId,
    shardsTxId,
    requiredArchaeologists
  } = useSelector(x => x.embalmState);
  const { isUploading } = useSelector(x => x.bundlrState);
  // const { uploadFile } = useBundlr();
  const { uploadArweaveFile } = useArweaveService();
  const { submitSarcophagus } = useSubmitSarcophagus();
  const { dialSelectedArchaeologists } = useSarcophagusNegotiation();
  const [currentStep, setCurrentStep] = useState(CreateSarcophagusStep.NOT_STARTED);
  const [stepExecuting, setStepExecuting] = useState(false);

  const incrementStep = (): void => {
    const currentIndex = createSarcophagusSteps.indexOf(currentStep);
    setCurrentStep(createSarcophagusSteps[currentIndex + 1]);
  };

  const executeStep = async (stepToExecute: Function, args?: any) => {
    setStepExecuting(true);
    await stepToExecute();

    // Set current step to next step
    incrementStep();
    setStepExecuting(false);
  };

  useEffect(() => {
    (async () => {
      if (!stepExecuting) {
        switch (currentStep) {
          case CreateSarcophagusStep.DIAL_ARCHAEOLOGISTS:
            await executeStep(
              dialSelectedArchaeologists
            );
            break;
          case CreateSarcophagusStep.UPLOAD_ENCRYPTED_SHARDS:

            break;
          case CreateSarcophagusStep.ARCHAEOLOGIST_NEGOTIATION:

            break;
          case CreateSarcophagusStep.UPLOAD_PAYLOAD:

            break;
          case CreateSarcophagusStep.SUBMIT_SARCOPHAGUS:

            break;
        }
      }
    })();
  }, [currentStep, stepExecuting]);


  const uploadAndSetDoubleEncryptedFile = useCallback(async () => {
    const payload = await readFileDataAsBase64(file!);

    // Step 1: Encrypt the inner layer
    const encryptedInnerLayer = await encrypt(recipientState.publicKey, payload); // TODO: Restore this line and remove line below when in-app create sarco flow is ready

    // Step 2: Encrypt the outer layer
    const encryptedOuterLayer = await encrypt(outerPublicKey!, encryptedInnerLayer);

    // Step 3: Upload the double encrypted payload to the arweave bundlr
    const sarcophagusPayloadTxId = await uploadArweaveFile(encryptedOuterLayer); // TODO: change to use uploadFile for Bundlr, once local testing figured out

    dispatch(setSarcophagusPayloadTxId(sarcophagusPayloadTxId));
  }, [
    dispatch,
    file,
    outerPublicKey,
    recipientState.publicKey,
    uploadArweaveFile
  ]);

  const uploadAndSetEncryptedShards = useCallback(async () => {
    try {
      // Step 1: Split the outer layer private key using shamirs secret sharing
      const shards: Uint8Array[] = split(outerPrivateKey, {
        shares: selectedArchaeologists.length,
        threshold: requiredArchaeologists
      });

      // Step 2: Encrypt each shard of the outer layer private key using each archaeologist's public
      // key
      const archPublicKeys = selectedArchaeologists.map(x => x.publicKey!);
      const encryptedShards = await encryptShards(archPublicKeys, shards);

      // Step 3: Upload the encrypted shards mapping to the arweave bundlr
      const mapping: Record<string, string> = encryptedShards.reduce(
        (acc, shard) => ({
          ...acc,
          [shard.publicKey]: shard.encryptedShard
        }),
        {}
      );

      const encryptedShardsTxId = await uploadArweaveFile(Buffer.from(JSON.stringify(mapping))); // TODO: change to use uploadFile for Bundlr, once local testing figured out

      dispatch(setShardPayloadData(encryptedShards, encryptedShardsTxId));
      return { encryptedShards, encryptedShardsTxId };
    } catch (error) {
      console.error(error);
    }
  }, [
    requiredArchaeologists,
    outerPrivateKey,
    selectedArchaeologists,
    uploadArweaveFile,
    dispatch
  ]);

  const handleCreate = useCallback(async () => {
    setCurrentStep(CreateSarcophagusStep.DIAL_ARCHAEOLOGISTS);
  }, [currentStep]);

  return {
    currentStep,
    uploadAndSetEncryptedShards,
    uploadAndSetDoubleEncryptedFile,
    handleCreate,
    payloadTxId,
    shardsTxId
  };
}
