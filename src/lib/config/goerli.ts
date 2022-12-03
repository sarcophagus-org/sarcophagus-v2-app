import { NetworkConfig } from './networkConfigType';

export const goerliNetworkConfig: NetworkConfig = {
  chainId: 5,
  networkName: 'Goerli Testnet',
  networkShortName: 'Goerli',
  sarcoTokenAddress: '0x4633b43990b41B57b3678c6F3Ac35bA75C3D8436',
  diamondDeployAddress: '0x270Ffc6B0e0d8b8F66C30965AF25cB872B2Ee273',
  etherscanApiUrl: 'https://api-goerli.etherscan.io/api',
  etherscanApiKey: '',
  explorerUrl: 'https://goerli.etherscan.io/',
  bundlr: {
    currencyName: 'ethereum',
    nodeUrl: 'https://devnet.bundlr.network',
    providerUrl: 'https://rpc.ankr.com/eth_goerli',
  },
  arweaveConfig: {
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
    timeout: 20000,
    logging: false,
  },
};
