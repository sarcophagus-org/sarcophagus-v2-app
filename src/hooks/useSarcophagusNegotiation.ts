import { pipe } from 'it-pipe';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  setArchaeologistConnection,
  setArchaeologistSignature,
  setNegotiationTimestamp,
  setPublicKeysReady,
  setSignaturesReady,
} from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { NEGOTIATION_SIGNATURE_STREAM } from '../lib/config/node_config';
import { useCreateSarcophagus } from 'features/embalm/stepContent/hooks/useCreateSarcohpagus';
import { useCreateEncryptionKeypair } from 'features/embalm/stepContent/hooks/useCreateEncryptionKeypair';
import { ArchaeologistEncryptedShard } from 'types';
import { useSubmitSarcophagus } from 'hooks/embalmerFacet';
import { useLibp2p } from './libp2p/useLibp2p';
import { BigNumber } from 'ethers';
import { useApprove } from './sarcoToken/useApprove';
import { useAllowance } from './sarcoToken/useAllowance';
import { getLowestRewrapInterval } from '../lib/utils/helpers';

interface SarcophagusNegotiationParams {
  arweaveTxId: string;
  unencryptedShardDoubleHash: string;
  maxRewrapInterval: BigNumber;
  diggingFee: string;
  timestamp: number;
}

export function useSarcophagusNegotiation() {
  const dispatch = useDispatch();
  const { selectedArchaeologists, publicKeysReady, signaturesReady, payloadTxId } = useSelector(
    s => s.embalmState
  );

  const { resetPublicKeyStream } = useLibp2p();
  const libp2pNode = useSelector(s => s.appState.libp2pNode);

  const dialSelectedArchaeologists = useCallback(async () => {
    await resetPublicKeyStream();

    selectedArchaeologists.map(async arch => {
      try {
        const connection = await libp2pNode?.dial(arch.fullPeerId!);
        if (!connection) throw Error('No connection obtained from dial');
        dispatch(setArchaeologistConnection(arch.profile.peerId, connection!));
      } catch (e) {
        console.error(`error connecting to ${arch.profile.peerId}`, e);
      }
    });
  }, [selectedArchaeologists, libp2pNode, dispatch, resetPublicKeyStream]);

  const initiateSarcophagusNegotiation = useCallback(
    async (archaeologistShards: ArchaeologistEncryptedShard[], encryptedShardsTxId: string): Promise<string[] | undefined> => {
      try {
        const lowestRewrapInterval = getLowestRewrapInterval(selectedArchaeologists);

        const negotiationTimestamp = Date.now();
        dispatch(setNegotiationTimestamp(negotiationTimestamp));

        const archaeologistSignatures: string[] = [];

        await Promise.all(selectedArchaeologists.map(async arch => {
          if (!arch.connection)
            throw new Error(`No connection to archaeologist ${JSON.stringify(arch)}`);

          const negotiationParams: SarcophagusNegotiationParams = {
            arweaveTxId: encryptedShardsTxId,
            diggingFee: arch.profile.minimumDiggingFee.toString(),
            maxRewrapInterval: BigNumber.from(lowestRewrapInterval),
            timestamp: negotiationTimestamp,
            unencryptedShardDoubleHash: archaeologistShards.find(
              s => s.publicKey === arch.publicKey
            )!.unencryptedShardDoubleHash,
          };

          const outboundMsg = JSON.stringify(negotiationParams);

          const { stream } = await arch.connection.newStream(NEGOTIATION_SIGNATURE_STREAM);

          console.log('sending negotiation params to archaeologist:', arch.profile.peerId);
          await pipe([new TextEncoder().encode(outboundMsg)], stream, async source => {
            for await (const data of source) {
              const dataStr = new TextDecoder().decode(data);
              // TODO: remove these logs after we gain some confidence in this exchange
              console.log('got', dataStr);

              const { signature }: { signature: string } = JSON.parse(dataStr);
              console.log('setting arch signature');
              console.log(signature);
              archaeologistSignatures.push(signature);
              dispatch(setArchaeologistSignature(arch.profile.peerId, signature!));
            }
          }).finally(() => {
              stream.close();
            }
          );
        }));

        return archaeologistSignatures;
      } catch (err) {
        //TODO figure out what to do at this point
        console.error(`Error in peer connection listener: ${err}`);
      }
    },
    [selectedArchaeologists, dispatch]
  );

  // Update publicKeysReady
  useEffect(
    () =>
      dispatch(
        setPublicKeysReady(
          selectedArchaeologists.length > 0 &&
            selectedArchaeologists.filter(arch => arch.publicKey === undefined).length === 0
        )
      ),
    [selectedArchaeologists, dispatch]
  );

  // Update signaturesReady
  useEffect(
    () =>
      dispatch(
        setSignaturesReady(
          selectedArchaeologists.length > 0 &&
            selectedArchaeologists.filter(arch => arch.signature === undefined).length === 0
        )
      ),
    [selectedArchaeologists, dispatch]
  );

  // TODO: Remove all shard setup simulation code below once create sarco flow is properly wired up
  // TODO: `initiateSarcophagusNegotiation` and `submitSarcophagus` should be intentionally called in response to UI action
  const { uploadAndSetEncryptedShards, uploadAndSetDoubleEncryptedFile } = useCreateSarcophagus();
  const { createEncryptionKeypair } = useCreateEncryptionKeypair();
  const { submitSarcophagus } = useSubmitSarcophagus();

  // Simulate private key sharding and upload to arweave when public keys ready
  let runSimulation = useRef(true);
  let runCreateSimulation = useRef(true);
  useEffect(() => {
    (async () => {
      if (publicKeysReady && runSimulation.current) {
        runSimulation.current = false;

        await createEncryptionKeypair();
        const { encryptedShards, encryptedShardsTxId } = await uploadAndSetEncryptedShards();
        console.log('initiating sarco negotiation');
        const archaeologistSignatures = await initiateSarcophagusNegotiation(encryptedShards, encryptedShardsTxId);
        console.log(
          'arch sigs:',
          archaeologistSignatures
        );
        await uploadAndSetDoubleEncryptedFile();
      }
    })();
  }, [
    publicKeysReady,
    dispatch,
    initiateSarcophagusNegotiation,
    runSimulation,
    createEncryptionKeypair,
    uploadAndSetEncryptedShards,
  ]);

  // TODO: move this to its own hook and refactor when create sarcophagus flow is finalized
  // Simulate call to create sarco when signatures ready
  // Likely scenario is to use signaturesReady to visually prompt user to
  // click that final submit button to make the contract call.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const { approve } = useApprove();
  const { allowance } = useAllowance();

  // useEffect(() => {
  //   if (signaturesReady && runCreateSimulation.current) {
  //     runCreateSimulation.current = false;
  //     console.log('signatures ready');
  //     uploadAndSetDoubleEncryptedFile();
  //   }
  //
  //   if (!!payloadTxId && !allowance?.gt(0) && !isApproving) {
  //     setIsApproving(true);
  //     approve();
  //   }
  //
  //   if (!!payloadTxId && !isSubmitting && allowance?.gt(0)) {
  //     setIsSubmitting(true);
  //     console.log('file upload to arweave complete, submitting create sarcophagus');
  //     submitSarcophagus();
  //   }
  // }, [
  //   signaturesReady,
  //   dispatch,
  //   payloadTxId,
  //   uploadAndSetDoubleEncryptedFile,
  //   submitSarcophagus,
  //   isApproving,
  //   allowance,
  //   approve,
  //   isSubmitting,
  // ]);

  return {
    dialSelectedArchaeologists,
    initiateSarcophagusNegotiation,
  };
}
