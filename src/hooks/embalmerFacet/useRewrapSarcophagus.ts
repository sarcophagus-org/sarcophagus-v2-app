import { EmbalmerFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useSubmitTransaction } from '../useSubmitTransaction';
import { Abi } from 'abitype';

interface RewrapSarcophagusArgs {
  sarcoId: string;
  resurrectionTime: number;
}

export function useRewrapSarcophagus({ sarcoId, resurrectionTime }: RewrapSarcophagusArgs) {
  const toastDescription = 'Sarcophagus rewrapped';
  const transactionDescription = 'Rewrap sarcophagus';

  const { submit } = useSubmitTransaction({
    abi: EmbalmerFacet__factory.abi as Abi,
    functionName: 'rewrapSarcophagus',
    args: [sarcoId, resurrectionTime],
    toastDescription,
    transactionDescription,
    mode: 'prepared',
  });

  return { rewrapSarcophagus: submit };
}
