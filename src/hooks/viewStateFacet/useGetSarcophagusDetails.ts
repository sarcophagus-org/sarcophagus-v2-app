import { useContractRead } from 'wagmi';
import { ViewStateFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useNetworkConfig } from 'lib/config';
import { Sarcophagus } from 'types';
import { useEffect, useState } from 'react';

export function useGetSarcophagusDetails({ sarcoId }: { sarcoId: string | undefined }) {
  const networkConfig = useNetworkConfig();
  const [sarcophagus, setSarcophagus] = useState<Sarcophagus | undefined>(undefined);

  const { data, refetch, isLoading } = useContractRead({
    address: networkConfig.diamondDeployAddress,
    abi: ViewStateFacet__factory.abi,
    functionName: 'getSarcophagus',
    args: [sarcoId],
    enabled: !!sarcoId,
  });

  useEffect(() => {
    (async () => {
      await refetch();
      if (data) {
        const s = { ...(data as Sarcophagus) };
        s.id = sarcoId || '';
        setSarcophagus(s);
      } else {
        setSarcophagus(undefined);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sarcoId]); //disabled eslint. if getSarcophagus is added as a depenancy, then useState / useEffect will do a re-render loop

  return { sarcophagus, refetch, isLoading };
}
