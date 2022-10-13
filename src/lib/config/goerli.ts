import { NetworkConfig } from './networkConfigType';

export const goerliNetworkConfig: NetworkConfig = {
  chainId: 5,
  networkName: 'Goerli Testnet',
  networkShortName: 'Goerli',
  sarcoTokenAddress: '',
  diamondDeployAddress: '',
  bundlr: {
    currencyName: 'ethereum',
    nodeUrl: 'https://devnet.bundlr.network',
    providerUrl: 'https://rpc.ankr.com/eth_goerli',
  },
};
