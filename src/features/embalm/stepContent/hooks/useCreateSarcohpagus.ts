import { ethers } from 'ethers';
import { doubleHashShard, encrypt, readFileDataAsBase64 } from 'lib/utils/helpers';
import { useCallback, useEffect, useState } from 'react';
import { split } from 'shamirs-secret-sharing-ts';
// import { setIsUploading } from 'store/bundlr/actions';
import { useSelector } from 'store/index';
import { useBundlr } from './useBundlr';
import { useSubmitSarcophagus } from 'hooks/embalmerFacet';
import { ArchaeologistEncryptedShard } from 'types';
import useArweaveService from 'hooks/useArweaveService';
import { useSarcophagusNegotiation } from 'hooks/useSarcophagusNegotiation';
import { useNetworkConfig } from 'lib/config';

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
  CreateSarcophagusStage.COMPLETED,
];

async function encryptShards(
  publicKeys: string[],
  payload: Uint8Array[]
): Promise<ArchaeologistEncryptedShard[]> {
  return Promise.all(
    publicKeys.map(async (publicKey, i) => ({
      publicKey,
      encryptedShard: ethers.utils.hexlify(await encrypt(publicKey, Buffer.from(payload[i]))),
      unencryptedShardDoubleHash: doubleHashShard(payload[i]),
    }))
  );
}

export function useCreateSarcophagus() {
  const {
    recipientState,
    file,
    outerPublicKey,
    outerPrivateKey,
    selectedArchaeologists,
    requiredArchaeologists,
  } = useSelector(x => x.embalmState);
  // const { isUploading } = useSelector(x => x.bundlrState); // TODO: Dunno what to do with isUploading but it seems important. Uncomment and use as needed.
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

  const arweaveTxIds = [sarcophagusPayloadTxId, encryptedShardsTxId];

  const { submitSarcophagus } = useSubmitSarcophagus({
    negotiationTimestamp,
    archaeologistSignatures,
    archaeologistShards,
    arweaveTxIds,
    currentStage,
  });

  const uploadToArweave = useCallback(async (data: Buffer): Promise<string> => {
    const txId = networkConfig.chainId === 31337 ?
      await uploadArweaveFile(data) :
      await uploadFile(data);

    return txId;
  }, [uploadArweaveFile, uploadFile, networkConfig.chainId]);

  const processUploadToArweaveError = (error: any) => {
    console.error(error);
    if (error.isFromArweave) { // TODO: need to determine if `error` is arweave error, process accordingly
    } else {
      // All other errors are unexpected and cannot be handled by the user.
      throw new Error('Something went wrong');
    }
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
      const archPublicKeys = selectedArchaeologists.filter(arch => arch.publicKey !== undefined).map(x => x.publicKey!);
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
  }, [
    file,
    outerPublicKey,
    recipientState.publicKey,
    uploadToArweave,
    setSarcophagusPayloadTxId,
  ]);

  // TODO -- add approval stage
  useEffect(() => {
    (async () => {
      const incrementStage = (): void => {
        const currentIndex = createSarcophagusStages.indexOf(currentStage);
        setCurrentStage(createSarcophagusStages[currentIndex + 1]);
      };

      const executeStage = async (
        stageToExecute: (...args: any[]) => Promise<any>,
        ...stageArgs: any[]
      ): Promise<any> => new Promise((resolve, reject) => {
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
              } else {
                const offendingArchs = selectedArchaeologists.filter(arch => arch.exception !== undefined);
                console.log('Not all selected archaeologists have responded', offendingArchs.map(a => `${a.profile.peerId}: ${a.exception!.message}`));
                // This is only a problem if `offendingArchs` is not empty. If empty, we simply haven't yet heard back from some of them.
                // We might consider implementing a timeout of sorts, to avoid waiting too long if no exceptions are thrown but no response ever comes in.

                // TODO: Point out offending archs -- what should the user do??
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
              } else {
                const offendingArchs = selectedArchaeologists.filter(arch => arch.exception !== undefined);
                console.log('Not all selected archaeologists have signed off', offendingArchs.map(a => `${a.profile.peerId}:\n ${a.exception!.code}: ${a.exception!.message}`));
                // This is only a problem if `offendingArchs` is not empty. If empty, we simply haven't yet heard back from some of them.
                // We might consider implementing a timeout of sorts, to avoid waiting too long if no exceptions are thrown but no response ever comes in.

                // TODO: Point out offending archs: Some might have declined, others may have connection issues. Check `exception.code` on each to determine exception type -- what should the user do??
              }
              break;

            case CreateSarcophagusStage.SUBMIT_SARCOPHAGUS:
              if (submitSarcophagus) {
                await executeStage(submitSarcophagus)
                  .catch(e => {
                    // TODO: Might want to handle more specific RPC errors
                    console.error(e);
                    setStageError('Failed to submit sarcophagus to contract');
                  }
                  );
                break;
              }
          }
        } catch (e: any) {
          // Ideally expecting human readable errors here
          console.error(e);
          setStageError((e as Error).message);
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
    initiateSarcophagusNegotiation,
    uploadAndSetDoubleEncryptedFile,
    dialSelectedArchaeologists,
    submitSarcophagus,
    selectedArchaeologists,
    stageError,
  ]);

  // Update archaeologist public keys, signatures ready status
  useEffect(
    () => {
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
    },
    [selectedArchaeologists]
  );

  const handleCreate = async () => setCurrentStage(CreateSarcophagusStage.DIAL_ARCHAEOLOGISTS);

  return {
    currentStage,
    uploadAndSetEncryptedShards,
    uploadAndSetDoubleEncryptedFile,
    handleCreate,
    stageError,
  };
}
