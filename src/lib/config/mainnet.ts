import { NetworkConfig } from './networkConfigType';

export const mainnetNetworkConfig: NetworkConfig = {
  chainId: 1,
  networkName: 'Etherum Mainnet',
  networkShortName: 'Mainnet',
  // TODO: Add mainnet sarco token address
  sarcoTokenAddress: '',
  // TODO: Add mainnet diamond address
  diamondDeployAddress: '',
  etherscanApiUrl: 'https://api.etherscan.io/api',
  etherscanApiKey: process.env.REACT_APP_ETHERSCAN_API_KEY ?? '',
  explorerUrl: 'https://etherscan.io/',
  bundlr: {
    currencyName: 'ethereum',
    nodeUrl: 'https://node1.bundlr.network',
    providerUrl: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`,
  },
  arweaveConfig: {
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
    timeout: 20000,
    logging: false,
  },
};
