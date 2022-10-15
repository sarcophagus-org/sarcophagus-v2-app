import { BigNumber, ethers, utils } from 'ethers';
import { EmbalmerFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
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
    archaeologistEncryptedShards,
    signaturesReady,
    negotiationTimestamp,
  } = useSelector(x => x.embalmState);

  const sarcoId = utils.id(name + Date.now().toString()); //TODO: verify this is correct way to generate

  const contractArchs = useMemo(() => {
    if (!signaturesReady) return [];

    return selectedArchaeologists.map(arch => {
      const { v, r, s } = ethers.utils.splitSignature(arch.signature!);
      return {
        archAddress: arch.profile.archAddress,
        diggingFee: arch.profile.minimumDiggingFee,
        unencryptedShardDoubleHash: archaeologistEncryptedShards.filter(
          shard => shard.publicKey === arch.publicKey
        )[0].unencryptedShardDoubleHash,
        v,
        r,
        s,
      };
    });
  }, [signaturesReady, selectedArchaeologists, archaeologistEncryptedShards]);

  const maximumRewrapInterval = useMemo(() => {
    if (!signaturesReady) return ethers.constants.Zero;

    let maxRewrapInterval = selectedArchaeologists[0].profile.maximumRewrapInterval;
    selectedArchaeologists.forEach(
      arch =>
        (maxRewrapInterval = arch.profile.maximumRewrapInterval.lt(maxRewrapInterval)
          ? arch.profile.maximumRewrapInterval
          : maxRewrapInterval)
    );

    return maxRewrapInterval;
  }, [selectedArchaeologists, signaturesReady]);

  // TODO: validate store-sourced args before making this call
  const { submit } = useSubmitTransaction({
    contractInterface: EmbalmerFacet__factory.abi,
    functionName: 'createSarcophagus',
    args: [
      sarcoId,
      {
        name,
        recipient: recipientState.address || '0xa1B1C565b740134aBBd3a11888F1B28bd2B52e96',
        resurrectionTime: BigNumber.from(Math.trunc(resurrection / 1000).toString()), // resurrection is in milliseconds, but saved in seconds on the contract,
        canBeTransferred: false, //TODO: default to false until transfer logic figured out
        minShards: Number.parseInt(requiredArchaeologists),
        timestamp: BigNumber.from(Math.trunc(negotiationTimestamp / 1000).toString()),
        maximumRewrapInterval,
      },
      contractArchs,
      [payloadTxId, shardsTxId],
    ],
    toastDescription,
    transactionDescription,
  });

  return { submitSarcophagus: submit };
}
