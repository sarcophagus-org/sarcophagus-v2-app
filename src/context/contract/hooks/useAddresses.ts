import { useState, useEffect } from 'react';

export function useAddresses(chainId: number | undefined) {
  const [addresses, setAddresses] = useState<{ moduleMap?: string }>({});

  useEffect(() => {
    if (!chainId) return;

    if (
      process.env.REACT_APP_LOCAL_CHAIN_ID &&
      chainId === parseInt(process.env.REACT_APP_LOCAL_CHAIN_ID, 10)
    ) {
      if (!process.env.REACT_APP_LOCAL_CONTRACT_ADDRESS) {
        console.error('No local addresses have been set!');
        setAddresses({});
        return;
      }

      setAddresses({
        moduleMap: process.env.REACT_APP_LOCAL_CONTRACT_ADDRESS,
      });
    } else {
      if (!process.env.REACT_APP_CONTRACT_ADDRESSES) {
        console.error('No addresses have been set!');
        setAddresses({});
        return;
      }

      const networksAddresses = JSON.parse(process.env.REACT_APP_CONTRACT_ADDRESSES);
      const moduleMapAddress: string = networksAddresses[chainId];

      if (!moduleMapAddress) {
        console.error(`Address for network ${chainId} is not set!`);
        setAddresses({});
        return;
      }

      setAddresses({
        moduleMap: moduleMapAddress,
      });
    }
  }, [chainId]);

  return addresses;
}
