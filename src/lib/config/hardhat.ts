import { NetworkConfig } from './networkConfigType';

export const hardhatNetworkConfig: NetworkConfig = {
  chainId: 31337,
  networkName: 'Hardhat Local Network',
  networkShortName: 'HardHat',
  sarcoTokenAddress: process.env.REACT_APP_SARCO_TOKEN_ADDRESS || '0x0',
  diamondDeployAddress: process.env.REACT_APP_LOCAL_CONTRACT_ADDRESS || '0x0',
  bundlr: {
    currencyName: '',
    nodeUrl: '',
    providerUrl: '',
    currencyContractAddress: '',
  },
};
