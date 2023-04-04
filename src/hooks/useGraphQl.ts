import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useCallback } from 'react';
import { useGetGracePeriod } from './viewStateFacet/useGetGracePeriod';

const graphQlClient = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/44302/sarcotest2/9',
  cache: new InMemoryCache(),
});

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

      let sarcos: SarcoDataSubgraph[] = (
        await graphQlClient.query({
          query: gql(getSarcosQuery(timestampSeconds, gracePeriod)),
          fetchPolicy: 'cache-first',
        })
      ).data.createSarcophaguses;

      const statsPromises: Promise<ArchStatsSubgraph[]> = Promise.all(
        sarcos.map(sarcoData => {
          const promise: Promise<ArchStatsSubgraph> = new Promise(async resolve => {
            let archsThatPublished: string[] = (
              await graphQlClient.query({
                query: gql(getPublishPrivateKeysQuery(sarcoData.sarcoId)),
                fetchPolicy: 'cache-first',
              })
            ).data.publishPrivateKeys.map((data: any) => data.archaeologist);

            // For each cursed arch on this sarco, check if they do NOT have a publish private key -- that's a failure
            sarcoData.cursedArchaeologists.map(archAddress => {
              const cursedArch = { ...archStats.find(arch => arch.address === archAddress)! };

              if (!archsThatPublished.includes(archAddress)) {
                cursedArch.failures = `${Number.parseInt(cursedArch.failures) + 1}`;
              }

              resolve(cursedArch);
            });
          });

          return promise;
        })
      );

      return await statsPromises;
    } catch (e) {
      console.error(e);
      return [];
    }
  }, [gracePeriod, timestampSeconds]);

  return { graphQlClient, getStats };
}
