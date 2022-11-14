import { useEffect, useState } from 'react';

// Uses CoinGecko's free api to get eth price.
// Caches the result in local storage for 5 minutes.
export function useEthPrice() {
  // Load the eth price from local storage into state
  const [ethPrice, setEthPrice] = useState(localStorage.getItem('eth_price') || '0');

  useEffect(() => {
    // Define the time the eth price should remain in local storage
    const cacheLength = 60_000 * 5; // 5 minutes

    (async () => {
      // Epoch timestamp for when the eth price cache expires
      const cacheExpiration = localStorage.getItem('eth_price_expiration');

      // Determines if the eth price cache is expired and should be fetched again
      const isCacheExpired = parseInt(cacheExpiration || '0') + cacheLength < new Date().getTime();

      if (ethPrice === '0' || isCacheExpired) {
        // TODO: Replace this api call with one that has higher rate limits.
        // Fetch the eth price from CoinGecko
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
        );
        const data = await response.json();
        setEthPrice(data.ethereum.usd);

        // Store the eth price and cache expiration in local storage
        localStorage.setItem('eth_price', data.ethereum.usd);
        localStorage.setItem('eth_price_expiration', new Date().getTime().toString());
      }
    })();
  }, [ethPrice]);

  return ethPrice;
}
