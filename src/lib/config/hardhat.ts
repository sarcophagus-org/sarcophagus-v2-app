import { NetworkConfig } from './networkConfigType';

export const hardhatNetworkConfig: NetworkConfig = {
  chainId: 31337,
  networkName: 'Hardhat Local Network',
  networkShortName: 'HardHat',
  sarcoTokenAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  diamondDeployAddress: '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82',
  explorerUrl: '',
  explorerApiKey: '',
  bundlr: {
    currencyName: 'ethereum',
    nodeUrl: 'https://devnet.bundlr.network',
    providerUrl: 'https://rpc.ankr.com/eth_goerli',
  },
};
