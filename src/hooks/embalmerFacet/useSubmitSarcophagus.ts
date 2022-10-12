import { ethers, utils } from 'ethers';
import { EmbalmerFacet } from 'lib/abi/EmbalmerFacet';
import { useSubmitTransaction } from '../useSubmitTransaction';
import { useSelector } from 'store/index';
import { useMemo } from 'react';

export function useSubmitSarcophagus() {
  const toastDescription = 'Sarcophagus created';
  const transactionDescription = 'Create sarcophagus';

  const {
    name,
    recipientState,
    resurrection,
    selectedArchaeologists,
    requiredArchaeologists,
    payloadTxId,
    shardsTxId,
    diggingFees,
    archaeologistEncryptedShards,
    signaturesReady,
  } = useSelector(x => x.embalmState);

  const sarcoId = utils.id(name + Date.now().toString()); //TODO: verify this is correct way to generate

  const contractArchs = useMemo(() => {
    if (!signaturesReady) return [];

    return selectedArchaeologists.map(arch => {
      const { v, r, s } = ethers.utils.splitSignature(arch.signature!);
      return {
        archAddress: arch.profile.archAddress,
        diggingFee: diggingFees,
        unencryptedShardDoubleHash: archaeologistEncryptedShards.filter(shard => shard.publicKey === arch.publicKey)[0].unencryptedShardDoubleHash,
        v, r, s,
      };
    });
  }, [signaturesReady, selectedArchaeologists, archaeologistEncryptedShards, diggingFees]);

  // TODO: validate store-sourced args before making this call
  const { submit } = useSubmitTransaction({
    contractInterface: EmbalmerFacet.abi,
    functionName: 'createSarcophagus',
    args: [
      sarcoId,
      {
        name,
        recipient: recipientState.address || '0xa1B1C565b740134aBBd3a11888F1B28bd2B52e96',
        resurrectionTime: Math.trunc(resurrection / 1000), // resurrection is in milliseconds, but saved in seconds on the contract
        canBeTransferred: false, //TODO: default to false until transfer logic figured out
        minShards: requiredArchaeologists,
      },
      contractArchs,
      [payloadTxId, shardsTxId],
    ],
    toastDescription,
    transactionDescription,
  });

  return { submitSarcophagus: submit };
}
