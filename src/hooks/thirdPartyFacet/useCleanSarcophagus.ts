import { useToast } from '@chakra-ui/react';
import { ThirdPartyFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { Abi } from 'abitype';
import { useNetworkConfig } from 'lib/config';
import { cleanFailure, cleanSuccess } from 'lib/utils/toast';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

// TODO - revisit when clean is ready
export function useCleanSarcophagus(sarcoId: string) {
  const networkConfig = useNetworkConfig();
  const toast = useToast();

  const { config } = usePrepareContractWrite({
    address: networkConfig.diamondDeployAddress,
    abi: ThirdPartyFacet__factory.abi as Abi,
    functionName: 'clean',
    args: [sarcoId],
  });

  const {
    write,
    isLoading: isCleaning,
    isSuccess,
    isError,
  } = useContractWrite({
    onSuccess() {
      toast(cleanSuccess());
    },
    onError(e) {
      console.error(e);
      toast(cleanFailure());
    },
    ...config,
  });

  console.log('isError', isError);

  return { clean: write, isCleaning, isSuccess, isError };
}
