import { BigNumber, ethers, utils } from 'ethers';
import { computeAddress } from 'ethers/lib/utils';
import { getLowestResurrectionTime, getLowestRewrapInterval } from '../../../../lib/utils/helpers';
import { RecipientState } from '../../../../store/embalm/actions';
import { Archaeologist } from '../../../../types';

type SubmitSarcophagusArgsTuple = [
  string,
  SubmitSarcophagusSettings,
  ContractArchaeologist[],
  string
];

export interface ContractArchaeologist {
  archAddress: string;
  diggingFeePerSecond: BigNumber;
  curseFee: BigNumber;
  publicKey: string;
  v: number;
  r: string;
  s: string;
}

export interface SubmitSarcophagusSettings {
  name: string;
  recipientAddress: `0x${string}`;
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
        diggingFeePerSecond: arch.profile.minimumDiggingFeePerSecond,
        curseFee: arch.profile.curseFee,
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
    recipientAddress: computeAddress(recipientState.publicKey) as `0x${string}`,
    resurrectionTime: Math.trunc(resurrection / 1000),
    threshold: requiredArchaeologists,
    creationTime: Math.trunc(negotiationTimestamp / 1000),
    maximumRewrapInterval: getLowestRewrapInterval(selectedArchaeologists),
    maximumResurrectionTime: getLowestResurrectionTime(selectedArchaeologists),
  };

  const contractArchaeologists = getContractArchaeologists();

  const submitSarcophagusArgs: SubmitSarcophagusArgsTuple = [
    sarcoId,
    {
      ...settings,
    },
    contractArchaeologists,
    arweaveTxId,
  ];

  return { submitSarcophagusArgs };
}
