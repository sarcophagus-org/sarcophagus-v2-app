import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useCallback } from 'react';
import { useGetGracePeriod } from './viewStateFacet/useGetGracePeriod';

const graphQlClient = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/44302/sarcotest2/9',
  cache: new InMemoryCache(),
});

// go through all sarco with res time less than current blockstamp, go through each's archs, check failures
const getSarcosQuery = (blockTimestamp: number, gracePeriod: number) => `query {
    createSarcophaguses (
        where: {resurrectionTime_lt: ${gracePeriod + blockTimestamp}},
        orderBy: resurrectionTime,
        orderDirection: desc
    ) {
        sarcoId
        resurrectionTime
        cursedArchaeologists
    }
  }`;

const getStatsQuery = `query {
    archaeologists {
        address
        successes
        accusals
        failures
        blockTimestamp
    }
}`;

const getPublishPrivateKeysQuery = (sarcoId: string) => `query {
  publishPrivateKeys (where: { sarcoId: "${sarcoId}" }) {
    archaeologist
  }
}`;

export interface ArchStatsSubgraph {
  address: string;
  successes: string;
  accusals: string;
  failures: string;
  blockTimestamp: number;
}

export interface SarcoDataSubgraph {
  sarcoId: string;
  resurrectionTime: string;
  cursedArchaeologists: string[];
}

export function useGraphQl(timestampSeconds: number) {
  const gracePeriod = useGetGracePeriod();

  const getStats = useCallback(async (): Promise<ArchStatsSubgraph[]> => {
    try {
      let archStats: ArchStatsSubgraph[] = (
        await graphQlClient.query({
          query: gql(getStatsQuery),
          fetchPolicy: 'cache-first',
        })
      ).data.archaeologists;

      console.log('archStats', archStats);

      let sarcos: SarcoDataSubgraph[] = (
        await graphQlClient.query({
          query: gql(getSarcosQuery(timestampSeconds, gracePeriod)),
          fetchPolicy: 'cache-first',
        })
      ).data.createSarcophaguses;

      const finalArchStats: ArchStatsSubgraph[] = [];

      console.log('got sarcos');

      // Use a Promise.all instead, see if it improves speed
      for await (const sarcoData of sarcos) {
        let archsThatPublished: string[] = (
          await graphQlClient.query({
            query: gql(getPublishPrivateKeysQuery(sarcoData.sarcoId)),
            fetchPolicy: 'cache-first',
          })
        ).data.publishPrivateKeys.map((data: any) => data.archaeologist);

        console.log('publishKeysOnSarco', sarcoData.sarcoId, archsThatPublished);

        // For each cursed arch on this sarco, check if they do NOT have a publish private key -- that's a failure
        sarcoData.cursedArchaeologists.forEach(archAddress => {
          const cursedArch = { ...archStats.find(arch => arch.address === archAddress)! };

          if (!archsThatPublished.includes(archAddress)) {
            cursedArch.failures = `${Number.parseInt(cursedArch.failures) + 1}`;
          }

          finalArchStats.push(cursedArch);
        });
      }

      return finalArchStats;
    } catch (e) {
      console.error(e);
      return [];
    }
  }, [gracePeriod, timestampSeconds]);

  return { graphQlClient, getStats };
}
