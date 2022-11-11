import { EmbalmerFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { Abi } from 'abitype';
import { useState } from 'react';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { useNetworkConfig } from 'lib/config';

export function useRewrapSarcophagus({ sarcoId }: { sarcoId: string | undefined }) {
  const networkConfig = useNetworkConfig();

  const [resurectionTime, setResurectionTime] = useState<Date | null>(null);

  const timeInSeconds = resurectionTime ? Math.trunc(resurectionTime.getTime()) / 1000 : 0;

  const { config, isLoading } = usePrepareContractWrite({
    address: networkConfig.diamondDeployAddress,
    abi: EmbalmerFacet__factory.abi as Abi,
    functionName: 'rewrapSarcophagus',
    enabled: Boolean(resurectionTime),
    args: [sarcoId, timeInSeconds],
  });

  const { write, isLoading: isRewrapping, isSuccess } = useContractWrite(config);

  return { resurectionTime, setResurectionTime, rewrap: write, isLoading, isRewrapping, isSuccess };
}
