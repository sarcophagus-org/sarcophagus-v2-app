import { NetworkConfig } from './networkConfigType';

export const mainnetNetworkConfig: NetworkConfig = {
  chainId: 1,
  networkName: 'Etherum Mainnet',
  networkShortName: 'Mainnet',
  sarcoTokenAddress: '0x7697B462A7c4Ff5F8b55BDBC2F4076c2aF9cF51A',
  diamondDeployAddress: '0x0',
  bundlr: {
    currencyName: 'ethereum',
    nodeUrl: 'https://node1.bundlr.network',
    providerUrl: 'https://rpc.ankr.com/eth',
  },
};
