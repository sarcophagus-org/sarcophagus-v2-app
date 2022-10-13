import { EmbalmerFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useSubmitTransaction } from '../useSubmitTransaction';

interface RewrapSarcophagusArgs {
  sarcoId: string;
  resurrectionTime: number;
}

export function useRewrapSarcophagus({ sarcoId, resurrectionTime }: RewrapSarcophagusArgs) {
  const toastDescription = 'Sarcophagus rewrapped';
  const transactionDescription = 'Rewrap sarcophagus';

  const { submit } = useSubmitTransaction({
    contractInterface: EmbalmerFacet__factory.abi,
    functionName: 'rewrapSarcophagus',
    args: [sarcoId, resurrectionTime],
    toastDescription,
    transactionDescription,
  });

  return { rewrapSarcophagus: submit };
}
