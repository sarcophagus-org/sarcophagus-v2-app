import { BigNumber, ethers, utils } from 'ethers';
import { EmbalmerFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useSubmitTransaction } from '../useSubmitTransaction';
import { useSelector } from '../../store';
import { getLowestRewrapInterval } from '../../lib/utils/helpers';
import { ArchaeologistEncryptedShard } from '../../types';
import { useCallback } from 'react';
import { CreateSarcophagusStage } from '../../features/embalm/stepContent/hooks/useCreateSarcophagus';
import { computeAddress } from 'ethers/lib/utils';
import { Abi } from 'abitype';

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
  resurrectionTime: number;
  minShards: number;
  timestamp: number;
  maximumRewrapInterval: number;
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
    resurrectionTime: Math.trunc(resurrection / 1000),
    minShards: requiredArchaeologists,
    timestamp: Math.trunc(negotiationTimestamp / 1000),
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

  const { submit, error } = useSubmitTransaction({
    abi: EmbalmerFacet__factory.abi as Abi,
    functionName: 'createSarcophagus',
    args,
    toastDescription,
    transactionDescription,
    mode: 'prepared'
  });

  const submitSarcophagus = args.length && !error ? submit : undefined;

  return { submitSarcophagus };
}
