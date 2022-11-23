import { useCallback, useContext, useState } from 'react';
import {
  CreateSarcophagusContext,
  initialCreateSarcophagusState,
} from '../../context/CreateSarcophagusContext';
import { useDispatch, useSelector } from '../../../../../store';
import { resetEmbalmState, setArchaeologistConnection } from '../../../../../store/embalm/actions';
import { Step } from '../../../../../store/embalm/reducer';

export interface SuccessData {
  successEncryptedShardsTxId: string;
  successSarcophagusPayloadTxId: string;
  successSarcophagusTxId: string;
}

export function useClearSarcophagusState() {
  const {
    setOuterPrivateKey,
    setOuterPublicKey,
    setArchaeologistShards,
    encryptedShardsTxId,
    setEncryptedShardsTxId,
    setNegotiationTimestamp,
    setArchaeologistSignatures,
    sarcophagusPayloadTxId,
    setSarcophagusPayloadTxId,
    sarcophagusTxId,
    setSarcophagusTxId,
  } = useContext(CreateSarcophagusContext);

  const dispatch = useDispatch();
  const { selectedArchaeologists } = useSelector(x => x.embalmState);
  const libp2pNode = useSelector(s => s.appState.libp2pNode);

  const [successEncryptedShardsTxId, setSuccessEncryptedShardsTxId] = useState('');
  const [successSarcophagusPayloadTxId, setSuccessSarcophagusPayloadTxId] = useState('');
  const [successSarcophagusTxId, setSuccessSarcophagusTxId] = useState('');

  const clearSarcophagusState = useCallback(async () => {
    // Set local TX IDs to display on the success page
    setSuccessEncryptedShardsTxId(encryptedShardsTxId);
    setSuccessSarcophagusPayloadTxId(sarcophagusPayloadTxId);
    setSuccessSarcophagusTxId(sarcophagusTxId);

    // reset state local to create sarcophagus
    setOuterPrivateKey(initialCreateSarcophagusState.outerPrivateKey);
    setOuterPublicKey(initialCreateSarcophagusState.outerPublicKey);
    setArchaeologistShards(initialCreateSarcophagusState.archaeologistShards);
    setEncryptedShardsTxId(initialCreateSarcophagusState.encryptedShardsTxId);
    setNegotiationTimestamp(initialCreateSarcophagusState.negotiationTimestamp);
    setArchaeologistSignatures(initialCreateSarcophagusState.archaeologistSignatures);
    setSarcophagusPayloadTxId(initialCreateSarcophagusState.sarcophagusPayloadTxId);
    setSarcophagusTxId(initialCreateSarcophagusState.sarcophagusTxId);

    // reset global embalm state
    dispatch(resetEmbalmState(Step.CreateSarcophagus));

    // hang up archaeologists and reset connection
    for await (const arch of selectedArchaeologists) {
      if (arch.connection) {
        libp2pNode?.hangUp(arch.fullPeerId!);
        dispatch(setArchaeologistConnection(arch.fullPeerId!.toString(), undefined));
      }
    }
  }, [
    encryptedShardsTxId,
    sarcophagusPayloadTxId,
    sarcophagusTxId,
    setOuterPrivateKey,
    setOuterPublicKey,
    setArchaeologistShards,
    setEncryptedShardsTxId,
    setNegotiationTimestamp,
    setArchaeologistSignatures,
    setSarcophagusPayloadTxId,
    setSarcophagusTxId,
    dispatch,
  ]);

  return {
    clearSarcophagusState,
    successData: {
      successEncryptedShardsTxId,
      successSarcophagusPayloadTxId,
      successSarcophagusTxId,
    } as SuccessData,
  };
}
