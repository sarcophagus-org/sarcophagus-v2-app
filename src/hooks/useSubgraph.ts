import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import * as Sentry from '@sentry/react';

const graphQlClient = new ApolloClient({
  uri: process.env.REACT_APP_SUBGRAPH_API_URL,
  cache: new InMemoryCache(),
});

const getSarcoRewrapsQuery = (sarcoId: string) => `query {
  rewrapSarcophaguses (where: {sarcoId: "${sarcoId}"}) { id }
}`;

// TODO: Deprecate this hook and use the sarco-sdk instead (move getSarcophagusRewraps to sarco-sdk)
export function useGraphQl() {
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

  return { getSarcophagusRewraps };
}
