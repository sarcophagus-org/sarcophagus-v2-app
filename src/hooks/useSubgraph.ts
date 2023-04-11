import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useCallback } from 'react';
import { useGetGracePeriod } from './viewStateFacet/useGetGracePeriod';
import * as Sentry from '@sentry/react';

const graphQlClient = new ApolloClient({
  uri: process.env.REACT_APP_SUBGRAPH_API_URL,
  cache: new InMemoryCache(),
});

export interface ArchDataSubgraph {
  address: string;
  successes: string[];
  accusals: string;
  failures: string;
  peerId: string;
  freeBond: string;
  maximumResurrectionTime: string;
  maximumRewrapInterval: string;
  minimumDiggingFeePerSecond: string;
  curseFee: string;
}

interface SarcoDataSubgraph {
  sarcoId: string;
  resurrectionTime: string;
  cursedArchaeologists: string[];
}

interface SarcosAndStats {
  archaeologists: ArchDataSubgraph[];
  sarcophagusDatas: SarcoDataSubgraph[];
}

const getArchsAndSarcosQuery = (blockTimestamp: number, gracePeriod: number) => `query {
    sarcophagusDatas (
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
        freeBond
        maximumResurrectionTime
        maximumRewrapInterval
        minimumDiggingFeePerSecond
        curseFee
        peerId
    }
  }`;

export function useGraphQl(timestampSeconds: number) {
  const gracePeriod = useGetGracePeriod();

  const getArchaeologists = useCallback(async (): Promise<ArchDataSubgraph[]> => {
    try {
      const { archaeologists, sarcophagusDatas } = (
        await graphQlClient.query({
          query: gql(getArchsAndSarcosQuery(timestampSeconds, gracePeriod)),
          fetchPolicy: 'cache-first',
        })
      ).data as SarcosAndStats;

      const aggregatedFailures: ArchDataSubgraph[] = await Promise.all(
        sarcophagusDatas.map(sarcoData => {
          const promise: Promise<ArchDataSubgraph> = new Promise(async resolve => {
            sarcoData.cursedArchaeologists.map(archAddress => {
              const cursedArch = { ...archaeologists.find(arch => arch.address === archAddress)! };

              // If this cursed arch doesn't have this sarcoId in its successes, then it never published
              if (!cursedArch.successes.includes(sarcoData.sarcoId)) {
                cursedArch.failures = `${Number.parseInt(cursedArch.failures) + 1}`;
              }

              resolve(cursedArch);
            });
          });

          return promise;
        })
      );

      // `aggregatedFailures` will contain duplicate archaeologists as they can be cursed on multiple sarcophagi.
      // Code below adds up the total failures on each archaeologist
      const finalArchData = archaeologists.map(arch => {
        const aggregatedFailuresOnArch = aggregatedFailures
          .filter(data => data.address === arch.address);

        if (aggregatedFailuresOnArch.length == 0) {
          return arch;
        }

        return aggregatedFailuresOnArch.reduce((prev, cur) => ({
          ...cur,
          failures: `${Number.parseInt(prev.failures) + Number.parseInt(cur.failures)}`,
        }));

      }
      );

      return finalArchData;
    } catch (e) {
      console.error(e);
      Sentry.captureException(e, { fingerprint: ['SUBGRAPH_EXCEPTION'] });
      return [];
    }
  }, [gracePeriod, timestampSeconds]);

  return { getArchaeologists };
}
