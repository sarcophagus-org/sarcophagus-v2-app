import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useCallback } from 'react';
import { useGetGracePeriod } from './viewStateFacet/useGetGracePeriod';
import * as Sentry from '@sentry/react';

const graphQlClient = new ApolloClient({
  uri:
    process.env.REACT_APP_SUBGRAPH_API_URL ||
    'https://api.studio.thegraph.com/query/44302/sarcotest2/10',
  cache: new InMemoryCache(),
});

export interface ArchStatsSubgraph {
  address: string;
  successes: string;
  accusals: string;
  failures: string;
  blockTimestamp: number;
}

interface SarcoDataSubgraph {
  sarcoId: string;
  resurrectionTime: string;
  cursedArchaeologists: string[];
}

interface SarcosAndStats {
  archaeologists: ArchStatsSubgraph[];
  createSarcophaguses: SarcoDataSubgraph[];
}

const getSarcosAndStatsQuery = (blockTimestamp: number, gracePeriod: number) => `query {
    createSarcophaguses (
        where: {resurrectionTime_lt: ${gracePeriod + blockTimestamp}},
        orderBy: resurrectionTime,
        orderDirection: desc
    ) {
        sarcoId
        resurrectionTime
        cursedArchaeologists
    },
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

export function useGraphQl(timestampSeconds: number) {
  const gracePeriod = useGetGracePeriod();

  const getStats = useCallback(async (): Promise<ArchStatsSubgraph[]> => {
    try {
      const { archaeologists: archStats, createSarcophaguses } = (
        await graphQlClient.query({
          query: gql(getSarcosAndStatsQuery(timestampSeconds, gracePeriod)),
          fetchPolicy: 'cache-first',
        })
      ).data as SarcosAndStats;

      const statsPromises: Promise<ArchStatsSubgraph[]> = Promise.all(
        createSarcophaguses.map(sarcoData => {
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
      Sentry.captureException(e, { fingerprint: ['SUBGRAPH_EXCEPTION'] });
      return [];
    }
  }, [gracePeriod, timestampSeconds]);

  return { getStats };
}
