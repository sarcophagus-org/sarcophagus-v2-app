import { contractAddresses, tokenAddresses } from './contract_addresses';
import { NetworkConfig } from './networkConfigType';

const chainId = 137;

export const maticNetworkConfig: NetworkConfig = {
  chainId,
  networkName: 'Polygon (Matic)',
  networkShortName: 'Matic',
  sarcoTokenAddress: tokenAddresses[chainId.toString()],
  diamondDeployAddress: contractAddresses[chainId.toString()],
  bundlr: {
    currencyName: 'matic',
    nodeUrl: 'https://node1.bundlr.network',
    providerUrl: 'https://polygon-rpc.com',
  },
};
