import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import * as Sentry from '@sentry/react';
import { useNetwork } from 'wagmi';

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
  const { chain } = useNetwork();

  const graphQlClient = useMemo(
    () =>
      new ApolloClient({
        uri:
          chain?.id === 1
            ? process.env.REACT_APP_SUBGRAPH_API_URL
            : process.env.REACT_APP_SUBGRAPH_API_URL_TESTNET,
        cache: new InMemoryCache(),
      }),
    [chain]
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

  const getSarcophagusRewraps = useCallback(async (sarcoId: string) => {
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
  }, [graphQlClient]);

  return { getArchaeologists, getSarcophagusRewraps };
}
