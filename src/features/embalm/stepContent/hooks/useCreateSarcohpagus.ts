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
import { useSarcophagusNegotiation } from '../../../../hooks/useSarcophagusNegotiation';
import { useNetworkConfig } from 'lib/config';

// TODO: change to stage
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

  const uploadAndSetEncryptedShards = useCallback(async () => {
    try {
      // Step 1: Split the outer layer private key using shamirs secret sharing
      const shards: Uint8Array[] = split(outerPrivateKey, {
        shares: selectedArchaeologists.length,
        threshold: requiredArchaeologists,
      });
      console.log('shards', shards);


      // Step 2: Encrypt each shard of the outer layer private key using each archaeologist's public
      // key
      const archPublicKeys = selectedArchaeologists.filter(arch => arch.publicKey !== undefined).map(x => x.publicKey!);
      const encShards = await encryptShards(archPublicKeys, shards);
      console.log('archPublicKeys', archPublicKeys);


      // Step 3: Upload the encrypted shards mapping to the arweave bundlr
      const mapping: Record<string, string> = encShards.reduce(
        (acc, shard) => ({
          ...acc,
          [shard.publicKey]: shard.encryptedShard,
        }),
        {}
      );

      const txId = await uploadArweaveFile(Buffer.from(JSON.stringify(mapping))); // TODO: change to use uploadFile for Bundlr, once local testing figured out

      setArchaeologistShards(encShards);
      setEncryptedShardsTxId(txId);
    } catch (error) {
      console.error(error);
    }
  }, [requiredArchaeologists, outerPrivateKey, selectedArchaeologists, uploadArweaveFile]);

  const uploadAndSetDoubleEncryptedFile = useCallback(async () => {
    const payload = await readFileDataAsBase64(file!);

    // Step 1: Encrypt the inner layer
    const encryptedInnerLayer = await encrypt(recipientState.publicKey, payload);

    // Step 2: Encrypt the outer layer
    const encryptedOuterLayer = await encrypt(outerPublicKey!, encryptedInnerLayer);

    // Step 3: Upload the double encrypted payload to the arweave bundlr
    // Use uploadArweaveFile is connected to hardhat local, uploadFile (from bundlr) for any other
    // TODO: May or may not make more sense to abstract away this check.
    const payloadTxId = networkConfig.chainId === 31337 ?
      await uploadArweaveFile(encryptedOuterLayer) :
      await uploadFile(encryptedOuterLayer);

    setSarcophagusPayloadTxId(payloadTxId);
  }, [
    file,
    outerPublicKey,
    recipientState.publicKey,
    uploadArweaveFile,
    uploadFile,
    networkConfig.chainId,
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

      if (!stageExecuting) {
        try {
          switch (currentStage) {
            case CreateSarcophagusStage.DIAL_ARCHAEOLOGISTS:
              const archsWithPublicKeys = await executeStage(dialSelectedArchaeologists);
              console.log('res', archsWithPublicKeys);

              break;
            case CreateSarcophagusStage.UPLOAD_ENCRYPTED_SHARDS:
              console.log('upload shards');

              if (publicKeysReady) {
                await executeStage(uploadAndSetEncryptedShards);
              } else {
                const offendingArchs = selectedArchaeologists.filter(arch => arch.exception !== undefined);
                console.log('Not all selected archaeologists responded', offendingArchs.map(a => `${a.profile.peerId}: ${a.exception!.message}`));
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
              await executeStage(uploadAndSetDoubleEncryptedFile);
              break;
            case CreateSarcophagusStage.SUBMIT_SARCOPHAGUS:
              if (submitSarcophagus) {
                await executeStage(submitSarcophagus);
                break;
              }
          }
        } catch (e) {
          if (!(typeof e === 'string')) {
            // Only expecting human readable errors here
            throw e;
          }
          setStageError(e as string);
        }
      }
    })();
  }, [
    currentStage,
    stageExecuting,
    publicKeysReady,
    archaeologistShards,
    encryptedShardsTxId,
    setArchaeologistSignatures,
    uploadAndSetEncryptedShards,
    initiateSarcophagusNegotiation,
    uploadAndSetDoubleEncryptedFile,
    dialSelectedArchaeologists,
    submitSarcophagus,
    selectedArchaeologists,
  ]);

  useEffect(
    () => setPublicKeysReady(
      selectedArchaeologists.length > 0 &&
      selectedArchaeologists.filter(arch => arch.publicKey === undefined).length === 0
    ),
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
