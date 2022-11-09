import { useCallback, useContext } from 'react';
import {
  CreateSarcophagusContext,
  initialCreateSarcophagusState,
} from '../../context/CreateSarcophagusContext';
import { useDispatch } from '../../../../../store';
import { resetEmbalmState } from '../../../../../store/embalm/actions';
import { Step } from '../../../../../store/embalm/reducer';

export function useClearSarcophagusState() {
  const {
    setPublicKeysReady,
    setOuterPrivateKey,
    setOuterPublicKey,
    setArchaeologistShards,
    setEncryptedShardsTxId,
    setNegotiationTimestamp,
    setArchaeologistSignatures,
    setSarcophagusPayloadTxId,
  } = useContext(CreateSarcophagusContext);

  const dispatch = useDispatch();

  const clearCreateSarcophagusState = useCallback(async () => {
    // reset state local to create sarcophagus
    setPublicKeysReady(initialCreateSarcophagusState.publicKeysReady);
    setOuterPrivateKey(initialCreateSarcophagusState.outerPrivateKey);
    setOuterPublicKey(initialCreateSarcophagusState.outerPublicKey);
    setArchaeologistShards(initialCreateSarcophagusState.archaeologistShards);
    setEncryptedShardsTxId(initialCreateSarcophagusState.encryptedShardsTxId);
    setNegotiationTimestamp(initialCreateSarcophagusState.negotiationTimestamp);
    setArchaeologistSignatures(initialCreateSarcophagusState.archaeologistSignatures);
    setSarcophagusPayloadTxId(initialCreateSarcophagusState.sarcophagusPayloadTxId);

    // reset global embalm state
    dispatch(resetEmbalmState(Step.CreateSarcophagus));
  }, [
    setPublicKeysReady,
    setOuterPrivateKey,
    setOuterPublicKey,
    setArchaeologistShards,
    setEncryptedShardsTxId,
    setNegotiationTimestamp,
    setArchaeologistSignatures,
    setSarcophagusPayloadTxId,
    dispatch,
  ]);

  return {
    clearSarcophagusState: clearCreateSarcophagusState,
  };
}
