import { BigNumber, ethers, utils } from 'ethers';
import { getLowestResurrectionTime, getLowestRewrapInterval } from '../../../../lib/utils/helpers';
import { Archaeologist } from '../../../../types';
import { computeAddress } from 'ethers/lib/utils';
import { RecipientState } from '../../../../store/embalm/actions';

export interface ContractArchaeologist {
  archAddress: string;
  diggingFee: BigNumber;
  publicKey: string;
  v: number;
  r: string;
  s: string;
}

export interface SubmitSarcophagusSettings {
  name: string;
  recipientAddress: string;
  resurrectionTime: number;
  threshold: number;
  creationTime: number;
  maximumRewrapInterval: number;
  maximumResurrectionTime: number;
}

export interface SubmitSarcophagusProps {
  name: string;
  recipientState: RecipientState;
  resurrection: number;
  selectedArchaeologists: Archaeologist[];
  requiredArchaeologists: number;
  negotiationTimestamp: number;
  archaeologistPublicKeys: Map<string, string>;
  archaeologistSignatures: Map<string, string>;
  arweaveTxId: string;
}

export function formatSubmitSarcophagusArgs({
  name,
  recipientState,
  resurrection,
  selectedArchaeologists,
  requiredArchaeologists,
  negotiationTimestamp,
  archaeologistPublicKeys,
  archaeologistSignatures,
  arweaveTxId,
}: SubmitSarcophagusProps) {
  const getContractArchaeologists = (): ContractArchaeologist[] => {
    return selectedArchaeologists.map(arch => {
      const { v, r, s } = ethers.utils.splitSignature(
        archaeologistSignatures.get(arch.profile.archAddress)!
      );
      return {
        archAddress: arch.profile.archAddress,
        diggingFee: arch.profile.minimumDiggingFeePerSecond,
        // TODO: #multiple-key-update - we may want further validation this exsits
        publicKey: archaeologistPublicKeys.get(arch.profile.archAddress)!,
        v,
        r,
        s,
      };
    });
  };

  const sarcoId = utils.id(name + Date.now().toString());
  const settings: SubmitSarcophagusSettings = {
    name,
    recipientAddress: recipientState.publicKey ? computeAddress(recipientState.publicKey) : '',
    resurrectionTime: Math.trunc(resurrection / 1000),
    threshold: requiredArchaeologists,
    creationTime: Math.trunc(negotiationTimestamp / 1000),
    maximumRewrapInterval: getLowestRewrapInterval(selectedArchaeologists),
    maximumResurrectionTime: getLowestResurrectionTime(selectedArchaeologists),
  };

  const contractArchaeologists = getContractArchaeologists();

  const args = [
    sarcoId,
    {
      ...settings,
    },
    contractArchaeologists,
    arweaveTxId,
  ];

  return { submitSarcophagusArgs: args };
}
