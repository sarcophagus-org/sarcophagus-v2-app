import { NetworkConfig } from './networkConfigType';

export const sepoliaNetworkConfig: NetworkConfig = {
  chainId: 11155111,
  networkName: 'Sepolia Testnet',
  networkShortName: 'Sepolia',
  sarcoTokenAddress: '0xfa1FA4d51FB2babf59e402c83327Ab5087441289',
  diamondDeployAddress: '0x478aDb74347AC204e1b382FC6B944621B97E8D98',
  etherscanApiUrl: 'https://api-sepolia.etherscan.io/api',
  etherscanApiKey: '',
  explorerUrl: 'https://sepolia.etherscan.io/',
  bundlr: {
    currencyName: 'ethereum',
    nodeUrl: 'https://devnet.bundlr.network',
    providerUrl:
      process.env.REACT_APP_BUNDLR_SEPOLIA_PROVIDER ?? 'https://rpc.ankr.com/eth_sepolia',
  },
  arweaveConfig: {
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
    timeout: 20000,
    logging: false,
  },
};
