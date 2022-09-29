import { ethers, utils } from 'ethers';
import { EmbalmerFacet } from 'lib/abi/EmbalmerFacet';
import { useSubmitTransaction } from '../useSubmitTransactions';
import { useSelector } from 'store/index';

export function useCreateSarcophagus() {
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
  } = useSelector(x => x.embalmState);

  const sarcoId = utils.id(name + Date.now().toString()); //TODO: verify this is correct way to generate

  function doubleHashShard(shard: Uint8Array | undefined): string {
    if (shard) {
      return ethers.utils.keccak256(ethers.utils.keccak256(shard));
    } else {
      return '';
    }
  }

  const contractArchs = selectedArchaeologists.map(arch => {
    return {
      archAddress: arch.profile.archAddress,
      diggingFee: arch.profile.minimumDiggingFee.toString(),
      unencryptedShardDoubleHash: doubleHashShard(arch.profile.shard),
      v: arch.profile.signature?.v,
      r: arch.profile.signature?.r,
      s: arch.profile.signature?.s,
    };
  });
  // unencryptedShardDoubleHash: arch.profile.shard
  // ? ethers.utils.keccak256(ethers.utils.keccak256(arch.profile.shard))
  // : '',

  const { submit } = useSubmitTransaction({
    contractInterface: EmbalmerFacet.abi,
    functionName: 'createSarcophagus',
    args: [
      sarcoId,
      {
        name: name,
        recipient: recipient.address,
        resurrectionTime: resurrection + Date.now(),
        canBeTransferred: true, //TODO: canBeTransferred
        minShards: requiredArchaeologists,
      },
      contractArchs,
      [payloadTxId, shardsTxId],
    ],
    toastDescription,
    transactionDescription,
  });

  return { createSarcophagus: submit };
}
