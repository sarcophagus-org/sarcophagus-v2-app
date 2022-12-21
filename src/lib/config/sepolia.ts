import { NetworkConfig } from './networkConfigType';

export const sepoliaNetworkConfig: NetworkConfig = {
  chainId: 5,
  networkName: 'Sepolia Testnet',
  networkShortName: 'Sepolia',
  sarcoTokenAddress: '0x663D82908Bd9f2735A5E5F7ceCA1e00F4ef39363',
  diamondDeployAddress: '0x21164Ec3AF79752DB98b908ff740731E80486027',
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
