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
  1: mainnetNetworkConfig(
    process.env.REACT_APP_MAINNET_PROVIDER!,
    process.env.REACT_APP_INFURA_API_KEY!
  ),
  5: goerliNetworkConfig(
    process.env.REACT_APP_GOERLI_PROVIDER!,
    process.env.REACT_APP_INFURA_API_KEY!
  ),
  11155111: sepoliaNetworkConfig(
    process.env.REACT_APP_SEPOLIA_PROVIDER!,
    process.env.REACT_APP_INFURA_API_KEY!
  ),
  31337: hardhatNetworkConfig,
};
