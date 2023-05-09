import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import * as Sentry from '@sentry/react';
import { useNetworkConfig } from 'lib/config';

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

const getArchsQuery = `query {
    archaeologists (orderBy: blockTimestamp, first: 1000) {
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

const getSarcoRewrapsQuery = (sarcoId: string) => `query {
  rewrapSarcophaguses (where: {sarcoId: "${sarcoId}"}) { id }
}`;

export function useGraphQl() {
  const networkConfig = useNetworkConfig();

  const graphQlClient = useMemo(
    () =>
      new ApolloClient({
        uri: networkConfig.subgraphUrl,
        cache: new InMemoryCache(),
      }),
    [networkConfig.subgraphUrl]
  );

  const getArchaeologists = useCallback(async (): Promise<ArchDataSubgraph[]> => {
    try {
      const { archaeologists } = (
        await graphQlClient.query({
          query: gql(getArchsQuery),
          fetchPolicy: 'cache-first',
        })
      ).data as { archaeologists: ArchDataSubgraph[] };

      return archaeologists;
    } catch (e) {
      console.error(e);
      Sentry.captureException(e, { fingerprint: ['SUBGRAPH_EXCEPTION'] });
      return [];
    }
  }, [graphQlClient]);

  const getSarcophagusRewraps = async (sarcoId: string) => {
    try {
      const { rewrapSarcophaguses } = (
        await graphQlClient.query({
          query: gql(getSarcoRewrapsQuery(sarcoId)),
          fetchPolicy: 'cache-first',
        })
      ).data as { rewrapSarcophaguses: any[] };

      return rewrapSarcophaguses;
    } catch (e) {
      console.error(e);
      Sentry.captureException(e, { fingerprint: ['SUBGRAPH_EXCEPTION'] });
      return [];
    }
  };

  return { getArchaeologists, getSarcophagusRewraps };
}
