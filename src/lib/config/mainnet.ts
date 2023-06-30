import { NetworkConfig } from './networkConfigType';

export const mainnetNetworkConfig: NetworkConfig = {
  chainId: 1,
  networkName: 'Etherum Mainnet',
  networkShortName: 'Mainnet',
  sarcoTokenAddress: '0x7697b462a7c4ff5f8b55bdbc2f4076c2af9cf51a',
  // TODO: Add mainnet diamond address
  diamondDeployAddress: '0x0Ec977D1863Eb919a2Ecd65d17Cc3f2CFdaCe3Ab',
  etherscanApiUrl: 'https://api.etherscan.io/api',
  etherscanApiKey: process.env.REACT_APP_ETHERSCAN_API_KEY ?? '',
  explorerUrl: 'https://etherscan.io/',
  bundlr: {
    currencyName: 'ethereum',
    nodeUrl: 'https://node1.bundlr.network',
    providerUrl: process.env.REACT_APP_INFURA_API_KEY
      ? `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`
      : 'https://rpc.ankr.com/eth',
  },
  arweaveConfig: {
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
    timeout: 20000,
    logging: false,
  },
};
