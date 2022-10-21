import { NetworkConfig } from './networkConfigType';

export const mainnetNetworkConfig: NetworkConfig = {
  chainId: 1,
  networkName: 'Etherum Mainnet',
  networkShortName: 'Mainnet',
  sarcoTokenAddress: '',
  diamondDeployAddress: '',
  explorerUrl: 'https://api.etherscan.io/api',
  explorerApiKey: '',
  bundlr: {
    currencyName: 'ethereum',
    nodeUrl: 'https://node1.bundlr.network',
    providerUrl: 'https://rpc.ankr.com/eth'
  }
};
