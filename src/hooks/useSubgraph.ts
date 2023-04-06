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
  successes: string;
  accusals: string;
  failures: string;
  peerId: string;
  freeBond: string;
  maximumResurrectionTime: string;
  maximumRewrapInterval: string;
  minimumDiggingFeePerSecond: string;
}

interface SarcoDataSubgraph {
  sarcoId: string;
  resurrectionTime: string;
  cursedArchaeologists: string[];
}

interface SarcosAndStats {
  archaeologists: ArchDataSubgraph[];
  createSarcophaguses: SarcoDataSubgraph[];
}

const getArchsAndSarcosQuery = (blockTimestamp: number, gracePeriod: number) => `query {
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
        freeBond
        maximumResurrectionTime
        maximumRewrapInterval
        minimumDiggingFeePerSecond
        peerId
    }
  }`;

const getArchPrivateKeyPublishesOnSarco = async (sarcoId: string): Promise<string[]> =>
  (
    await graphQlClient.query({
      query: gql(`query {
        publishPrivateKeys (where: { sarcoId: "${sarcoId}" }) {
          archaeologist
        }}`),
      fetchPolicy: 'cache-first',
    })
  ).data.publishPrivateKeys.map((data: any) => data.archaeologist);

export function useGraphQl(timestampSeconds: number) {
  const gracePeriod = useGetGracePeriod();

  const getArchaeologists = useCallback(async (): Promise<ArchDataSubgraph[]> => {
    try {
      const { archaeologists, createSarcophaguses } = (
        await graphQlClient.query({
          query: gql(getArchsAndSarcosQuery(timestampSeconds, gracePeriod)),
          fetchPolicy: 'cache-first',
        })
      ).data as SarcosAndStats;

      const aggregatedFailures: ArchDataSubgraph[] = await Promise.all(
        createSarcophaguses.map(sarcoData => {
          const promise: Promise<ArchDataSubgraph> = new Promise(async resolve => {
            // Each sarco's private key publishes needs to be queried. This is done within
            // a promise (array) to try to reduce execution time.
            const publishesOnSarco = await getArchPrivateKeyPublishesOnSarco(sarcoData.sarcoId);

            // For each sarco, check each of its cursed archs.
            // If they do NOT have a publish private key -- that's a failure for that arch.
            sarcoData.cursedArchaeologists.map(archAddress => {
              let cursedArch = { ...archaeologists.find(arch => arch.address === archAddress)! };

              if (!publishesOnSarco.includes(archAddress)) {
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
      const finalArchData = archaeologists.map(arch =>
        aggregatedFailures
          .filter(data => data.address === arch.address)!
          .reduce((prev, cur) => ({
            ...cur,
            failures: `${Number.parseInt(prev.failures) + Number.parseInt(cur.failures)}`,
          }))
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