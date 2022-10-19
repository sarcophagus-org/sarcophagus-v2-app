import { NetworkConfig } from './networkConfigType';

export const hardhatNetworkConfig: NetworkConfig = {
  chainId: 31337,
  networkName: 'Hardhat Local Network',
  networkShortName: 'HardHat',
  sarcoTokenAddress: process.env.REACT_APP_SARCO_TOKEN_ADDRESS!,
  diamondDeployAddress: process.env.REACT_APP_LOCAL_CONTRACT_ADDRESS!,
  bundlr: {
    currencyName: 'ethereum',
    nodeUrl: 'https://devnet.bundlr.network',
    providerUrl: 'https://rpc.ankr.com/eth_goerli',
  },
};
