import { useCallback, useContext, useState } from 'react';
import {
  CreateSarcophagusContext,
  initialCreateSarcophagusState,
} from '../../context/CreateSarcophagusContext';
import { useDispatch, useSelector } from '../../../../../store';
import {
  resetEmbalmState,
  setArchaeologistConnection,
  setSelectedArchaeologists,
} from '../../../../../store/embalm/actions';
import { Step } from '../../../../../store/embalm/reducer';
import { sarco } from 'sarcophagus-v2-sdk';

export interface SuccessData {
  successSarcophagusPayloadTxId: string;
  successSarcophagusTxId: string;
}

export function useClearSarcophagusState() {
  const {
    setPayloadPrivateKey,
    setPayloadPublicKey,
    setNegotiationTimestamp,
    setArchaeologistSignatures,
    sarcophagusPayloadTxId,
    setSarcophagusPayloadTxId,
    sarcophagusTxId,
    setSarcophagusTxId,
  } = useContext(CreateSarcophagusContext);

  const dispatch = useDispatch();
  const { selectedArchaeologists } = useSelector(x => x.embalmState);

  const [successSarcophagusPayloadTxId, setSuccessSarcophagusPayloadTxId] = useState('');
  const [successSarcophagusTxId, setSuccessSarcophagusTxId] = useState('');

  const clearSarcophagusState = useCallback(async () => {
    // Set local TX IDs to display on the success page
    setSuccessSarcophagusPayloadTxId(sarcophagusPayloadTxId);
    setSuccessSarcophagusTxId(sarcophagusTxId);

    // reset state local to create sarcophagus
    if (setPayloadPrivateKey) setPayloadPrivateKey(initialCreateSarcophagusState.payloadPrivateKey);
    if (setPayloadPublicKey) setPayloadPublicKey(initialCreateSarcophagusState.payloadPublicKey);
    if (setNegotiationTimestamp)
      setNegotiationTimestamp(initialCreateSarcophagusState.negotiationTimestamp);
    if (setArchaeologistSignatures)
      setArchaeologistSignatures(initialCreateSarcophagusState.archaeologistSignatures);
    if (setSarcophagusPayloadTxId)
      setSarcophagusPayloadTxId(initialCreateSarcophagusState.sarcophagusPayloadTxId);
    if (setSarcophagusTxId) setSarcophagusTxId(initialCreateSarcophagusState.sarcophagusTxId);

    // reset global embalm state
    dispatch(resetEmbalmState(Step.CreateSarcophagus));

    // hang up archaeologists and reset connection
    for await (const arch of selectedArchaeologists) {
      if (arch.connection) {
        sarco.archaeologist.hangUp(arch);
        dispatch(setArchaeologistConnection(arch.profile.peerId, undefined));
      }
    }

    setSelectedArchaeologists([]);
  }, [
    selectedArchaeologists,
    sarcophagusPayloadTxId,
    sarcophagusTxId,
    setPayloadPrivateKey,
    setPayloadPublicKey,
    setNegotiationTimestamp,
    setArchaeologistSignatures,
    setSarcophagusPayloadTxId,
    setSarcophagusTxId,
    dispatch,
  ]);

  return {
    clearSarcophagusState,
    successData: {
      successSarcophagusPayloadTxId,
      successSarcophagusTxId,
    } as SuccessData,
  };
}
