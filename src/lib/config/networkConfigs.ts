import { NetworkConfig } from './networkConfigType';
import {
  goerliNetworkConfig,
  mainnetNetworkConfig,
  sepoliaNetworkConfig,
} from '@sarcophagus-org/sarcophagus-v2-sdk-client';

export const hardhatChainId = 31337;

const hardhatNetworkConfig: NetworkConfig = {
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
  subgraphUrl: '',
};

export const networkConfigs: { [chainId: number]: NetworkConfig } = {
  1: mainnetNetworkConfig(process.env.REACT_APP_BUNDLR_MAINNET_PROVIDER!, {
    zeroExApiKey: process.env.REACT_APP_ZEROEX_API_KEY!,
  }),
  5: goerliNetworkConfig(process.env.REACT_APP_BUNDLR_GOERLI_PROVIDER!, {
    zeroExApiKey: process.env.REACT_APP_ZEROEX_API_KEY!,
  }),
  11155111: sepoliaNetworkConfig(process.env.REACT_APP_BUNDLR_SEPOLIA_PROVIDER!),
  31337: hardhatNetworkConfig,
};
