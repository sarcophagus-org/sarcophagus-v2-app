import { NetworkConfig } from './networkConfigType';

export const goerliNetworkConfig: NetworkConfig = {
  chainId: 5,
  networkName: 'Goerli Testnet',
  networkShortName: 'Goerli',
  sarcoTokenAddress: '0x4633b43990b41B57b3678c6F3Ac35bA75C3D8436',
  diamondDeployAddress: '0x814De2Db5D12E7e10B79D128Fca70Baba53d8394',
  explorerUrl: 'https://api-goerli.etherscan.io/api',
  explorerApiKey: '',
  bundlr: {
    currencyName: 'ethereum',
    nodeUrl: 'https://devnet.bundlr.network',
    providerUrl: 'https://rpc.ankr.com/eth_goerli',
  },
};
