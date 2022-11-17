import { useToast } from '@chakra-ui/react';
import { EmbalmerFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { Abi } from 'abitype';
import { useNetworkConfig } from 'lib/config';
import { buryFailure, burySuccess } from 'lib/utils/toast';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

export function useBurySarcophagus(sarcoId: string) {
  const networkConfig = useNetworkConfig();
  const toast = useToast();

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
      toast(burySuccess());
    },
    onError(e) {
      console.error(e);
      toast(buryFailure());
    },
    ...config,
  });

  return { bury: write, isLoading, isBurying, isSuccess };
}
