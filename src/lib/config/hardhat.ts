import { NetworkConfig } from './networkConfigType';

export const hardhatChainId = 31337;

export const hardhatNetworkConfig: NetworkConfig = {
  chainId: hardhatChainId,
  networkName: 'Hardhat Local Network',
  networkShortName: 'HardHat',
  sarcoTokenAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  diamondDeployAddress: '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0',
  etherscanApiUrl: '',
  etherscanApiKey: '',
  explorerUrl: '',
  bundlr: {
    currencyName: '',
    nodeUrl: '',
    providerUrl: '',
  },
  arweaveConfig: {
    host: 'localhost',
    port: 1984,
    protocol: 'http',
    timeout: 60000 * 30,
    logging: false,
  },
};
