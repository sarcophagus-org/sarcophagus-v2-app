import { EmbalmerFacet } from 'lib/abi/EmbalmerFacet';
import { useSubmitTransaction } from '../useSubmitTransaction';

interface RewrapSarcophagusArgs {
  sarcoId: string;
  resurrectionTime: number;
}

export function useRewrapSarcophagus({ sarcoId, resurrectionTime }: RewrapSarcophagusArgs) {
  const toastDescription = 'Sarcophagus rewrapped';
  const transactionDescription = 'Rewrap sarcophagus';

  const { submit } = useSubmitTransaction({
    contractInterface: EmbalmerFacet.abi,
    functionName: 'rewrapSarcophagus',
    args: [sarcoId, resurrectionTime],
    toastDescription,
    transactionDescription,
  });

  return { rewrapSarcophagus: submit };
}
