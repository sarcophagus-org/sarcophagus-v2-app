import { NetworkConfig } from './networkConfigType';

export const maticNetworkConfig: NetworkConfig = {
  chainId: 137,
  networkName: 'Polygon (Matic)',
  networkShortName: 'Matic',
  sarcoTokenAddress: '',
  diamondDeployAddress: '',
  explorerUrl: '',
  explorerApiKey: '',
  bundlr: {
    currencyName: 'matic',
    nodeUrl: 'https://node1.bundlr.network',
    providerUrl: 'https://polygon-rpc.com',
  },
  arweaveConfig: {
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
    timeout: 20000,
    logging: false,
  },
};
