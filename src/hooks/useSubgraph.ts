import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useCallback } from 'react';
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
  }, []);

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
