import { contractAddresses, tokenAddresses } from './contract_addresses';
import { NetworkConfig } from './networkConfigType';

const chainId = 1;

export const mainnetNetworkConfig: NetworkConfig = {
  chainId,
  networkName: 'Etherum Mainnet',
  networkShortName: 'Mainnet',
  sarcoTokenAddress: contractAddresses[chainId.toString()],
  diamondDeployAddress: tokenAddresses[chainId.toString()],
  bundlr: {
    currencyName: 'ethereum',
    nodeUrl: 'https://node1.bundlr.network',
    providerUrl: 'https://rpc.ankr.com/eth',
  },
};
