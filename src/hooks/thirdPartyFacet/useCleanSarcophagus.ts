import { useToast } from '@chakra-ui/react';
import { ThirdPartyFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { Abi } from 'abitype';
import { useGetSarcophagus } from 'hooks/viewStateFacet';
import { useNetworkConfig } from 'lib/config';
import { cleanFailure, cleanSuccess } from 'lib/utils/toast';
import { SarcophagusState } from 'types';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

// TODO - revisit when clean is ready
export function useCleanSarcophagus(sarcoId: string, paymentAddress: string | undefined) {
  const networkConfig = useNetworkConfig();
  const toast = useToast();

  const { sarcophagus } = useGetSarcophagus(sarcoId);

  const { config, isLoading } = usePrepareContractWrite({
    address: networkConfig.diamondDeployAddress,
    abi: ThirdPartyFacet__factory.abi as Abi,
    functionName: 'clean',
    enabled: sarcophagus?.state === SarcophagusState.Failed && !!paymentAddress && !!sarcoId,
    args: [sarcoId, paymentAddress],
  });

  const {
    write,
    isLoading: isCleaning,
    isSuccess,
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

  return { clean: write, isLoading, isCleaning, isSuccess };
}
