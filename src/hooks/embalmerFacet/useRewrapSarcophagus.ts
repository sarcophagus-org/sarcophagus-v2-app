import { EmbalmerFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { Abi } from 'abitype';
import { useState } from 'react';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { useNetworkConfig } from 'lib/config';

export function useRewrapSarcophagus({ sarcoId }: { sarcoId: string | undefined }) {
  const networkConfig = useNetworkConfig();

  const [resurectionTime, setResurectionTime] = useState('');

  const { config } = usePrepareContractWrite({
    address: networkConfig.diamondDeployAddress,
    abi: EmbalmerFacet__factory.abi as Abi,
    functionName: 'rewrapSarcophagus',
    enabled: Boolean(resurectionTime),
    args: [sarcoId, resurectionTime],
  });

  const { write } = useContractWrite(config);

  return { resurectionTime, setResurectionTime, write };
}
