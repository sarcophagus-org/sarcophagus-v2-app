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
    publicKeysReady,
    payloadTxId,
    shardsTxId,
    requiredArchaeologists
  } = useSelector(x => x.embalmState);
  const { isUploading } = useSelector(x => x.bundlrState);
  // const { uploadFile } = useBundlr();
  const { uploadArweaveFile } = useArweaveService();
  const { submitSarcophagus } = useSubmitSarcophagus();
  const { dialSelectedArchaeologists, initiateSarcophagusNegotiation } = useSarcophagusNegotiation();
  const [currentStep, setCurrentStep] = useState(CreateSarcophagusStep.NOT_STARTED);
  const [stepExecuting, setStepExecuting] = useState(false);
  const [archaeologistShards, setArchaeologistShards] = useState([] as ArchaeologistEncryptedShard[]);
  const [encryptedShardsTxId, setEncryptedShardsTxId] = useState('');

  const incrementStep = (): void => {
    const currentIndex = createSarcophagusSteps.indexOf(currentStep);
    setCurrentStep(createSarcophagusSteps[currentIndex + 1]);
  };

  const executeStep = async (stepToExecute: Function, ...args: any[]): Promise<any> => {
    return new Promise((resolve, reject) => {
      setStepExecuting(true);

      stepToExecute(...args).then((result: any) => {
        setStepExecuting(false);

        // Set current step to next step
        incrementStep();
        resolve(result);
      }).catch((error: any) => {
        setStepExecuting(false);
      });
    });
  };

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
      const encShards = await encryptShards(archPublicKeys, shards);

      // Step 3: Upload the encrypted shards mapping to the arweave bundlr
      const mapping: Record<string, string> = encShards.reduce(
        (acc, shard) => ({
          ...acc,
          [shard.publicKey]: shard.encryptedShard
        }),
        {}
      );

      const txId = await uploadArweaveFile(Buffer.from(JSON.stringify(mapping))); // TODO: change to use uploadFile for Bundlr, once local testing figured out
      console.log('setting shards', encShards);
      setArchaeologistShards(encShards);
      setEncryptedShardsTxId(txId);
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
            // TODO -- remove reliance on this global state var
            if (publicKeysReady) {
              await executeStep(
                uploadAndSetEncryptedShards
              );
            }
            break;
          case CreateSarcophagusStep.ARCHAEOLOGIST_NEGOTIATION:
            const archaeologistSignatures = await executeStep(
              initiateSarcophagusNegotiation,
              archaeologistShards,
              encryptedShardsTxId
            );
            break;
          case CreateSarcophagusStep.UPLOAD_PAYLOAD:

            break;
          case CreateSarcophagusStep.SUBMIT_SARCOPHAGUS:

            break;
        }
      }
    })();
  }, [currentStep, stepExecuting, publicKeysReady, archaeologistShards, encryptedShardsTxId]);

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
