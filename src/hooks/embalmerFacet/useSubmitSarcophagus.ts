import { ethers, utils } from 'ethers';
import { EmbalmerFacet } from 'lib/abi/EmbalmerFacet';
import { useSubmitTransaction } from '../useSubmitTransactions';
import { useSelector } from 'store/index';
import { useMemo } from 'react';

export function useSubmitSarcophagus() {
  const toastDescription = 'Sarcophagus created';
  const transactionDescription = 'Create sarcophagus';

  const {
    name,
    recipient,
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


  const { submit } = useSubmitTransaction({
    contractInterface: EmbalmerFacet.abi,
    functionName: 'createSarcophagus',
    args: [
      sarcoId,
      {
        name,
        recipient: recipient.address,
        resurrectionTime: resurrection / 1000,
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
