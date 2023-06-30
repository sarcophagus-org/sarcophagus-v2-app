import { EmbalmerFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useNetworkConfig } from 'lib/config';
import { useEffect, useState } from 'react';
import { useProvider } from 'wagmi';

export function useGetRecipientSarcophagi(recipient: string): string[] {
  const networkConfig = useNetworkConfig();
  const provider = useProvider();
  const [sarcoIds, setSarcoIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchSarcophagi = async () => {
      const contract = EmbalmerFacet__factory.connect(networkConfig.diamondDeployAddress, provider);
      const filter = contract.filters.CreateSarcophagus(null, null, null, null, null, recipient);
      try {
        const logs = await provider.getLogs({
          fromBlock: 0, // Adjust as needed
          toBlock: 'latest',
          address: networkConfig.diamondDeployAddress,
          topics: filter.topics,
        });

        const events = logs.map(log => contract.interface.parseLog(log)).map(event => event.args);
        setSarcoIds(events.map(s => s.sarcoId));
      } catch (error) {
        console.error(error);
      }
    };

    fetchSarcophagi();
  }, [networkConfig.diamondDeployAddress, provider, recipient]);

  return sarcoIds;
}
