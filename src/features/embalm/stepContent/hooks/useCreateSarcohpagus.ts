import { ethers } from 'ethers';
import { doubleHashShard, encrypt, readFileDataAsBase64 } from 'lib/utils/helpers';
import { useCallback, useEffect, useState } from 'react';
import { split } from 'shamirs-secret-sharing-ts';
import { useDispatch, useSelector } from 'store/index';
import { useSubmitSarcophagus } from 'hooks/embalmerFacet';
import { ArchaeologistEncryptedShard } from 'types';
import useArweaveService from 'hooks/useArweaveService';
import { useSarcophagusNegotiation } from '../../../../hooks/useSarcophagusNegotiation';
import { createEncryptionKeypairAsync } from './useCreateEncryptionKeypair';
import { chainId, useNetwork } from 'wagmi';
import { useBundlr } from './useBundlr';
import { disableSteps, enableSteps, resetEmbalmState } from 'store/embalm/actions';
import { useNavigate } from 'react-router-dom';

// Note: order matters here
// Also note: The number values of this enum are used to display the stage number
export enum CreateSarcophagusStage {
  NOT_STARTED,
  DIAL_ARCHAEOLOGISTS,
  UPLOAD_ENCRYPTED_SHARDS,
  ARCHAEOLOGIST_NEGOTIATION,
  UPLOAD_PAYLOAD,
  SUBMIT_SARCOPHAGUS,
  COMPLETED,
}

// Note: order matters here
const createSarcophagusStages = [
  CreateSarcophagusStage.NOT_STARTED,
  CreateSarcophagusStage.DIAL_ARCHAEOLOGISTS,
  CreateSarcophagusStage.UPLOAD_ENCRYPTED_SHARDS,
  CreateSarcophagusStage.ARCHAEOLOGIST_NEGOTIATION,
  CreateSarcophagusStage.UPLOAD_PAYLOAD,
  CreateSarcophagusStage.SUBMIT_SARCOPHAGUS,
  CreateSarcophagusStage.COMPLETED
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
    selectedArchaeologists,
    publicKeysReady,
    shardsTxId,
    requiredArchaeologists
  } = useSelector(x => x.embalmState);

  const navigate = useNavigate();

  // BUNDLR config
  const { uploadFile } = useBundlr();
  const { chain } = useNetwork();
  const shouldUseBundlr = chainId.hardhat !== chain!.id;

  const { uploadArweaveFile } = useArweaveService();
  const { dialSelectedArchaeologists, initiateSarcophagusNegotiation } =
    useSarcophagusNegotiation();
  const [currentStage, setCurrentStage] = useState(CreateSarcophagusStage.NOT_STARTED);
  const [stageExecuting, setStageExecuting] = useState(false);

  // Create Sarcophagus State
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

  const arweaveTxIds = [sarcophagusPayloadTxId, encryptedShardsTxId];

  const { submitSarcophagus } = useSubmitSarcophagus({
    negotiationTimestamp,
    archaeologistSignatures,
    archaeologistShards,
    arweaveTxIds,
    currentStage
  });

  // generates a random key with which to encrypt the outer layer of the sarcophagus
  useEffect(() => {
    (async () => {
      if (!outerPrivateKey) {
        const { privateKey, publicKey } = await createEncryptionKeypairAsync();
        setOuterPrivateKey(privateKey);
        setOuterPublicKey(publicKey);
      }
    })();
  });

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

      const txId = shouldUseBundlr
        ? await uploadFile(Buffer.from(JSON.stringify(mapping)))
        : await uploadArweaveFile(Buffer.from(JSON.stringify(mapping)));

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
    shouldUseBundlr,
    uploadFile
  ]);

  const uploadAndSetDoubleEncryptedFile = useCallback(async () => {
    const payload = await readFileDataAsBase64(file!);

    // Step 1: Encrypt the inner layer
    const encryptedInnerLayer = await encrypt(recipientState.publicKey, payload);

    // Step 2: Encrypt the outer layer
    const encryptedOuterLayer = await encrypt(outerPublicKey!, encryptedInnerLayer);

    // Step 3: Upload the double encrypted payload to the arweave bundlr

    const payloadTxId = shouldUseBundlr
      ? await uploadFile(encryptedOuterLayer)
      : await uploadArweaveFile(encryptedOuterLayer);

    setSarcophagusPayloadTxId(payloadTxId);
  }, [
    file,
    outerPublicKey,
    recipientState.publicKey,
    uploadArweaveFile,
    setSarcophagusPayloadTxId,
    shouldUseBundlr,
    uploadFile
  ]);

  const resetLocalEmbalmerState = useCallback(() => {
    setArchaeologistShards([] as ArchaeologistEncryptedShard[]);
    setEncryptedShardsTxId('');
    setSarcophagusPayloadTxId('');
    setArchaeologistSignatures(new Map<string, string>([]));
    setNegotiationTimestamp(0);
    setOuterPrivateKey('');
    setOuterPublicKey('');
  }, []);

  // TODO -- add approval stage
  useEffect(() => {
    (async () => {
      const incrementStage = (): void => {
        const currentIndex = createSarcophagusStages.indexOf(currentStage);
        setCurrentStage(createSarcophagusStages[currentIndex + 1]);
      };

      const executeStage = async (stageToExecute: Function, ...args: any[]): Promise<any> => {
        return new Promise((resolve, reject) => {
          setStageExecuting(true);

          stageToExecute(...args)
            .then((result: any) => {
              setStageExecuting(false);

              // Set current stage to next stage
              incrementStage();
              resolve(result);
            })
            .catch((error: any) => {
              setStageExecuting(false);
              reject(error);
            });
        });
      };

      if (!stageExecuting) {
        switch (currentStage) {
          case CreateSarcophagusStage.DIAL_ARCHAEOLOGISTS:
            await executeStage(dialSelectedArchaeologists);
            break;
          case CreateSarcophagusStage.UPLOAD_ENCRYPTED_SHARDS:
            // TODO -- remove reliance on this global state var
            if (publicKeysReady) {
              await executeStage(uploadAndSetEncryptedShards);
            }
            break;
          case CreateSarcophagusStage.ARCHAEOLOGIST_NEGOTIATION:
            setTimeout(async () => {
              await executeStage(
                initiateSarcophagusNegotiation,
                archaeologistShards,
                encryptedShardsTxId,
                setArchaeologistSignatures,
                setNegotiationTimestamp
              );
            }, 5000);
            break;
          case CreateSarcophagusStage.UPLOAD_PAYLOAD:
            await executeStage(uploadAndSetDoubleEncryptedFile);
            break;
          case CreateSarcophagusStage.SUBMIT_SARCOPHAGUS:
            if (submitSarcophagus) {
              await executeStage(submitSarcophagus);
            }
            break;
          case CreateSarcophagusStage.COMPLETED:
            resetLocalEmbalmerState();
            setTimeout(() => {
              navigate('/dashboard');
              dispatch(resetEmbalmState());
              dispatch(enableSteps());
            }, 4000);

            break;
        }
      }
    })();
  }, [
    archaeologistShards,
    currentStage,
    dialSelectedArchaeologists,
    dispatch,
    encryptedShardsTxId,
    initiateSarcophagusNegotiation,
    publicKeysReady,
    stageExecuting,
    submitSarcophagus,
    uploadAndSetDoubleEncryptedFile,
    uploadAndSetEncryptedShards,
    resetLocalEmbalmerState
  ]);

  const handleCreate = useCallback(async () => {
    setCurrentStage(CreateSarcophagusStage.DIAL_ARCHAEOLOGISTS);
    dispatch(disableSteps());
  }, [dispatch]);

  return {
    currentStage,
    uploadAndSetEncryptedShards,
    uploadAndSetDoubleEncryptedFile,
    handleCreate,
    shardsTxId
  };
}
