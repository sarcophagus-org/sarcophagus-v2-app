import { useState, useEffect } from 'react';
import { DEVELOPMENT } from '../../../constants';
import { ERRORS } from '../../../constants/logging';

export function useAddresses(chainId: number | undefined) {
  const [contractAddress, setContractAddress] = useState<string>();

  useEffect(() => {
    const env = process.env;
    if (!chainId) {
      return;
    }
    const localChainId = env.REACT_APP_LOCAL_CHAIN_ID;
    if (env.NODE_ENV === DEVELOPMENT && localChainId && chainId === parseInt(localChainId, 10)) {
      const localContractAddress = env.REACT_APP_LOCAL_CONTRACT_ADDRESS;
      if (!localContractAddress) {
        console.error(ERRORS.localAddress);
        return;
      }
      setContractAddress(localContractAddress);
      return;
    }
    const contractAddresses = env.REACT_APP_CONTRACT_ADDRESSES;
    if (!contractAddresses) {
      console.error(ERRORS.contractAddress);
      return;
    }
    const networksAddress = JSON.parse(contractAddresses);
    const envContractAddress: string = networksAddress[chainId];
    setContractAddress(envContractAddress);
  }, [chainId]);

  return contractAddress;
}
