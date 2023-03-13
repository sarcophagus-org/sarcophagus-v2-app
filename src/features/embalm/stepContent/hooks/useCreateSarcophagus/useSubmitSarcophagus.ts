import { ethers } from 'ethers';
import { useSelector } from '../../../../../store';
import { useCallback, useContext } from 'react';
import { formatSubmitSarcophagusArgs } from '../../utils/formatSubmitSarcophagusArgs';
import { CreateSarcophagusContext } from '../../context/CreateSarcophagusContext';
import { NonceManager } from '@ethersproject/experimental';

export function useSubmitSarcophagus(embalmerFacet: ethers.Contract) {
  const { name, recipientState, resurrection, selectedArchaeologists, requiredArchaeologists } =
    useSelector(x => x.embalmState);

  const {
    negotiationTimestamp,
    archaeologistPublicKeys,
    archaeologistSignatures,
    sarcophagusPayloadTxId,
    setSarcophagusTxId,
  } = useContext(CreateSarcophagusContext);

  const submitSarcophagus = useCallback(
    async (isRetry: boolean) => {
      const { submitSarcophagusArgs } = formatSubmitSarcophagusArgs({
        name,
        recipientState,
        resurrection,
        selectedArchaeologists,
        requiredArchaeologists,
        negotiationTimestamp,
        archaeologistPublicKeys,
        archaeologistSignatures,
        arweaveTxId: sarcophagusPayloadTxId,
      });


      const nonceManager = new NonceManager(embalmerFacet.signer);
      const txCount = await nonceManager.getTransactionCount();
      console.log('txCount', txCount);

      console.log('create sarco 1 -- should succeed');
      if (isRetry) {
        console.log('retrying with callStatic. should fail with duplicate key revert. txCount:', txCount);
        await embalmerFacet.callStatic.createSarcophagus(...submitSarcophagusArgs);
        // const tx = await embalmerFacet.createSarcophagus(...submitSarcophagusArgs, { nonce: txCount + 1 });
      } else {
        const tx = await embalmerFacet.createSarcophagus(...submitSarcophagusArgs);
        setSarcophagusTxId(tx.hash);
        await tx.wait();

        const nonceManagerNew = new NonceManager(embalmerFacet.signer);
        const txCountNew = await nonceManagerNew.getTransactionCount();
        console.log('txCount after successful tx', txCountNew);
      }

      console.log('create sarco 2 -- should fail, checking with callStatic');
      await embalmerFacet.callStatic.createSarcophagus(...submitSarcophagusArgs, { nonce: 62 });
    },
    [
      embalmerFacet,
      name,
      recipientState,
      resurrection,
      selectedArchaeologists,
      requiredArchaeologists,
      negotiationTimestamp,
      archaeologistPublicKeys,
      archaeologistSignatures,
      sarcophagusPayloadTxId,
      setSarcophagusTxId,
    ]
  );

  return {
    submitSarcophagus,
  };
}
