import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useMemo } from 'react';
import * as Sentry from '@sentry/react';
import { useNetworkConfig } from 'lib/config';

const getSarcoRewrapsQuery = (sarcoId: string) => `query {
  rewrapSarcophaguses (where: {sarcoId: "${sarcoId}"}) { id }
}`;

// TODO: Deprecate this hook and use the sarco-sdk instead (move getSarcophagusRewraps to sarco-sdk)
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
