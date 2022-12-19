import { NetworkConfig } from './networkConfigType';

export const sepoliaNetworkConfig: NetworkConfig = {
  chainId: 5,
  networkName: 'Sepolia Testnet',
  networkShortName: 'Sepolia',
  sarcoTokenAddress: '',
  diamondDeployAddress: '',
  etherscanApiUrl: 'https://api-sepolia.etherscan.io/api',
  etherscanApiKey: '',
  explorerUrl: 'https://sepolia.etherscan.io/',
  bundlr: {
    currencyName: 'ethereum',
    nodeUrl: 'https://devnet.bundlr.network',
    providerUrl: 'https://rpc.ankr.com/eth_sepolia',
  },
  arweaveConfig: {
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
    timeout: 20000,
    logging: false,
  },
};
