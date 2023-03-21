import { NetworkConfig } from './networkConfigType';

export const goerliNetworkConfig: NetworkConfig = {
  chainId: 5,
  networkName: 'Goerli Testnet',
  networkShortName: 'Goerli',
  sarcoTokenAddress: '0x4633b43990b41B57b3678c6F3Ac35bA75C3D8436',
  diamondDeployAddress: '0x96e6192eeaf7bb308f79fb5017a9085754b9e12a',
  etherscanApiUrl: 'https://api-goerli.etherscan.io/api',
  etherscanApiKey: process.env.REACT_APP_ETHERSCAN_API_KEY ?? '',
  explorerUrl: 'https://goerli.etherscan.io/',
  bundlr: {
    currencyName: 'ethereum',
    nodeUrl: 'https://devnet.bundlr.network',
    providerUrl: process.env.REACT_APP_BUNDLR_GOERLI_PROVIDER ?? 'https://rpc.ankr.com/eth_goerli',
  },
  arweaveConfig: {
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
    timeout: 20000,
    logging: false,
  },
};
