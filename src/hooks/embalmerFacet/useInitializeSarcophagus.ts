import { ethers } from 'ethers';
import { EmbalmerFacetABI } from '../../abis/EmbalmerFacet';
import { useSubmitTransaction } from '../useSubmitTransactions';

// TODO: Remove any
interface InitializeSarcophagusArgs {
  sarcoId: string;
  name: string;
  recipient: string;
  resurrectionTime: number;
  canBeTransferred: boolean;
  minShards: number;
  archaeologists: any[];
  arweaveArchaeologist: any;
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
    contractInterface: EmbalmerFacetABI,
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
