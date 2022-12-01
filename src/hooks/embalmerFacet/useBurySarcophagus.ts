import { EmbalmerFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { Abi } from 'abitype';
import { useSarcoToast } from 'components/SarcoToast';
import { useNetworkConfig } from 'lib/config';
import { buryFailure, burySuccess } from 'lib/utils/toast';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

export function useBurySarcophagus(sarcoId: string) {
  const networkConfig = useNetworkConfig();
  const sarcoToast = useSarcoToast();

  const { config, isLoading } = usePrepareContractWrite({
    address: networkConfig.diamondDeployAddress,
    abi: EmbalmerFacet__factory.abi as Abi,
    functionName: 'burySarcophagus',
    enabled: !!sarcoId,
    args: [sarcoId],
  });

  const {
    write,
    isLoading: isBurying,
    isSuccess,
  } = useContractWrite({
    onSuccess() {
      sarcoToast.open(burySuccess());
    },
    onError(e) {
      console.error(e);
      sarcoToast.open(buryFailure());
    },
    ...config,
  });

  return { bury: write, isLoading, isBurying, isSuccess };
}
