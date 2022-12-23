import { EmbalmerFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useSubmitTransaction } from '../useSubmitTransaction';
import { Abi } from 'abitype';

interface CancelSarcophagusArgs {
  sarcoId: string;
}

export function useCancelSarcophagus({ sarcoId }: CancelSarcophagusArgs) {
  const toastDescription = 'Sarcophagus canceled';
  const transactionDescription = 'Cancel sarcophagus';

  const { submit } = useSubmitTransaction({
    contractConfigParams: {
      abi: EmbalmerFacet__factory.abi as Abi,
      functionName: 'cancelSarcophagus',
      args: [sarcoId],
      mode: 'prepared',
    },
    toastDescription,
    transactionDescription,
  });

  return { cancelSarcophagus: submit };
}
