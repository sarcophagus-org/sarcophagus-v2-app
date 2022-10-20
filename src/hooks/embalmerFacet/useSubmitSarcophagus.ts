import { BigNumber, ethers, utils } from 'ethers';
import { EmbalmerFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useSubmitTransaction } from '../useSubmitTransaction';
import { useSelector } from '../../store';
import { getLowestRewrapInterval } from '../../lib/utils/helpers';
import { ArchaeologistEncryptedShard } from '../../types';
import { useCallback } from 'react';
import { CreateSarcophagusStage } from '../../features/embalm/stepContent/hooks/useCreateSarcohpagus';
import { computeAddress } from 'ethers/lib/utils';

export interface ContractArchaeologist {
  archAddress: string;
  diggingFee: BigNumber;
  unencryptedShardDoubleHash: string;
  v: number;
  r: string;
  s: string;
}

export interface SubmitSarcophagusSettings {
  name: string;
  recipient: string;
  resurrectionTime: BigNumber;
  minShards: number;
  timestamp: BigNumber;
  maximumRewrapInterval: number | BigNumber;
}

export interface SubmitSarcophagusProps {
  negotiationTimestamp: number;
  archaeologistSignatures: Map<string, string>;
  archaeologistShards: ArchaeologistEncryptedShard[];
  arweaveTxIds: string[];
  currentStage: CreateSarcophagusStage;
}

export function useSubmitSarcophagus({
  negotiationTimestamp,
  archaeologistSignatures,
  archaeologistShards,
  arweaveTxIds,
  currentStage,
}: SubmitSarcophagusProps) {
  const toastDescription = 'Sarcophagus created';
  const transactionDescription = 'Create sarcophagus';

  const { name, recipientState, resurrection, selectedArchaeologists, requiredArchaeologists } =
    useSelector(x => x.embalmState);

  const isSubmitting = currentStage === CreateSarcophagusStage.SUBMIT_SARCOPHAGUS;

  const getContractArchaeologists = useCallback((): ContractArchaeologist[] => {
    if (!isSubmitting) {
      return [];
    }

    return selectedArchaeologists.map(arch => {
      const { v, r, s } = ethers.utils.splitSignature(
        archaeologistSignatures.get(arch.profile.archAddress)!
      );
      return {
        archAddress: arch.profile.archAddress,
        diggingFee: arch.profile.minimumDiggingFee,
        unencryptedShardDoubleHash: archaeologistShards.filter(
          shard => shard.publicKey === arch.publicKey
        )[0].unencryptedShardDoubleHash,
        v,
        r,
        s,
      };
    });
  }, [selectedArchaeologists, archaeologistShards, archaeologistSignatures, isSubmitting]);

  const sarcoId = utils.id(name + Date.now().toString());
  const settings: SubmitSarcophagusSettings = {
    name,
    recipient: recipientState.publicKey ? computeAddress(recipientState.publicKey) : '',
    resurrectionTime: BigNumber.from(Math.trunc(resurrection / 1000).toString()),
    minShards: requiredArchaeologists,
    timestamp: BigNumber.from(Math.trunc(negotiationTimestamp / 1000).toString()),
    maximumRewrapInterval: getLowestRewrapInterval(selectedArchaeologists),
  };

  const contractArchaeologists = getContractArchaeologists();
  const args =
    isSubmitting && contractArchaeologists.length
      ? [
          sarcoId,
          {
            ...settings,
          },
          contractArchaeologists,
          arweaveTxIds,
        ]
      : [];

  const { submit } = useSubmitTransaction({
    contractInterface: EmbalmerFacet__factory.abi,
    functionName: 'createSarcophagus',
    args,
    toastDescription,
    transactionDescription,
  });

  const submitSarcophagus = args.length ? submit : undefined;

  return { submitSarcophagus };
}
