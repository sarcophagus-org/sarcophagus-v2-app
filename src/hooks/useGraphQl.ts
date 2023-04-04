import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useCallback } from 'react';

const graphQlClient = new ApolloClient({
    uri: 'https://api.studio.thegraph.com/query/44302/sarcotest2/8',
    cache: new InMemoryCache()
});

// go through all sarco with res time less than current blockstamp, go through each's archs, check failures

const getArchsQuery = `query {
    archaeologists {
        address
        successes
        accusals
        blockTimestamp
    }
}`;

const getSarcoQuery = `query {
    createSarcophaguses (
        where: { blockTimestamp_gte: blockTimestamp }
        orderBy:resurrectionTime,
        orderDirection: desc
    ) {
        sarcoId
        resurrectionTime
    }
}`;

const getStatsQuery = `query {
    archaeologists {
        address
        successes
        accusals
        blockTimestamp
    }
}`;

export function useGraphQl() {

    // if (
    //     sarco.cursedArchaeologists[arch].privateKey == 0 &&
    //     sarco.resurrectionTime != 2 ** 256 - 1 &&
    //     block.timestamp > sarco.resurrectionTime + s.gracePeriod
    // ) {
    //     failures += 1;
    // }

    const getStats = useCallback(async () => {
        try {
            let result = await graphQlClient.query({
                query: gql(getStatsQuery),
                fetchPolicy: 'cache-first',
            });
            return result.data;
        } catch (e) {
            console.error(e);
        }
    }, [getStatsQuery]);

    const getArchs = useCallback(async () => {
        try {
            let result = await graphQlClient.query({
                query: gql(getArchsQuery),
                fetchPolicy: 'cache-first',
            });
            return result.data;
        } catch (e) {
            console.error(e);
        }
    }, []);

    return { graphQlClient, getStats, getArchs };
}