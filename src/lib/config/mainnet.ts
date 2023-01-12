import { NetworkConfig } from './networkConfigType';

export const mainnetNetworkConfig: NetworkConfig = {
  chainId: 1,
  networkName: 'Etherum Mainnet',
  networkShortName: 'Mainnet',
  sarcoTokenAddress: '',
  diamondDeployAddress: '',
  etherscanApiUrl: 'https://api.etherscan.io/api',
  etherscanApiKey: '',
  explorerUrl: 'https://etherscan.io/',
  bundlr: {
    currencyName: 'ethereum',
    nodeUrl: 'https://node1.bundlr.network',
    providerUrl: process.env.REACT_APP_BUNDLR_MAINNET_PROVIDER ?? 'https://rpc.ankr.com/eth',
  },
  arweaveConfig: {
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
    timeout: 20000,
    logging: false,
  },
};
