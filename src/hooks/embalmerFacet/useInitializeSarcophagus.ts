import { ethers } from 'ethers';
import { EmbalmerFacet } from '../../abi/EmbalmerFacet';
import { ContractArchaeologist } from '../../types';
import { useSubmitTransaction } from '../useSubmitTransactions';

interface InitializeSarcophagusArgs {
  sarcoId: string;
  name: string;
  recipient: string;
  resurrectionTime: number;
  canBeTransferred: boolean;
  minShards: number;
  archaeologists: ContractArchaeologist[];
  arweaveArchaeologist: ContractArchaeologist;
}

export function useInitializeSarcophagus({
  sarcoId,
  name,
  recipient,
  resurrectionTime,
  canBeTransferred,
  minShards,
  archaeologists,
  arweaveArchaeologist,
}: InitializeSarcophagusArgs) {
  const toastDescription = 'Sarcophagus initialized';
  const transactionDescription = 'Initialize sarcophagus';

  const { submit } = useSubmitTransaction({
    contractInterface: EmbalmerFacet.abi,
    functionName: 'initializeSarcophagus',
    args: [
      ethers.utils.formatBytes32String(sarcoId),
      {
        name,
        recipient,
        resurrectionTime,
        canBeTransferred,
        minShards,
      },
      archaeologists,
      arweaveArchaeologist,
    ],
    toastDescription,
    transactionDescription,
  });

  return { initializeSarcophagus: submit };
}
