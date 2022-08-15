import { EmbalmerFacetABI } from '../../abis/EmbalmerFacet';
import { useSubmitTransaction } from '../useSubmitTransactions';

interface RewrapSarcophagusArgs {
  sarcoId: string;
  resurrectionTime: number;
}

export function useRewrapSarcophagus({ sarcoId, resurrectionTime }: RewrapSarcophagusArgs) {
  const toastDescription = 'Sarcophagus rewrapped';
  const transactionDescription = 'Rewrap sarcophagus';

  const { submit } = useSubmitTransaction({
    contractInterface: EmbalmerFacetABI,
    functionName: 'rewrapSarcophagus',
    args: [sarcoId, resurrectionTime],
    toastDescription,
    transactionDescription,
  });

  return { rewrapSarcophagus: submit };
}
