import { NetworkConfig } from './networkConfigType';

export const maticNetworkConfig: NetworkConfig = {
  chainId: 137,
  networkName: 'Polygon (Matic)',
  networkShortName: 'Matic',
  sarcoTokenAddress: '',
  diamondDeployAddress: '',
  bundlr: {
    currencyName: 'matic',
    nodeUrl: 'https://node1.bundlr.network',
    providerUrl: 'https://polygon-rpc.com',
  },
};
