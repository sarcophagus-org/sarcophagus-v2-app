import { NetworkConfig } from './networkConfigType';

export const sepoliaNetworkConfig: NetworkConfig = {
  chainId: 5,
  networkName: 'Sepolia Testnet',
  networkShortName: 'Sepolia',
  sarcoTokenAddress: '0xfa1FA4d51FB2babf59e402c83327Ab5087441289',
  diamondDeployAddress: '0x16EF124Cc2BB82501c47AaC756Ae92194920396e',
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
