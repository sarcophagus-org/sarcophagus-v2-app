import { ethers, utils } from 'ethers';
import { EmbalmerFacet } from 'lib/abi/EmbalmerFacet';
import { useSubmitTransaction } from '../useSubmitTransactions';
import { useSelector } from 'store/index';

function doubleHashShard(shard: Uint8Array): string {
  console.log('shard', shard);
  if (shard) {
    return ethers.utils.keccak256(ethers.utils.keccak256(shard));
  } else {
    return '';
  }
}

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
    shards,
  } = useSelector(x => x.embalmState);

  const sarcoId = utils.id(name + Date.now().toString()); //TODO: verify this is correct way to generate

  const contractArchs = selectedArchaeologists.map((arch, index) => {
    return {
      archAddress: arch.profile.archAddress,
      diggingFee: arch.profile.minimumDiggingFee.toString(),
      unencryptedShardDoubleHash: doubleHashShard(shards[index]),
      v: arch.profile.signature?.v,
      r: arch.profile.signature?.r,
      s: arch.profile.signature?.s,
    };
  });

  const { submit } = useSubmitTransaction({
    contractInterface: EmbalmerFacet.abi,
    functionName: 'createSarcophagus',
    args: [
      sarcoId,
      {
        name: name,
        recipient: recipient.address,
        resurrectionTime: resurrection / 1000,
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
