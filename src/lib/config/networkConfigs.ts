import { NetworkConfig } from './networkConfigType';
import { hardhatNetworkConfig } from './hardhat';
import {
  goerliNetworkConfig,
  sepoliaNetworkConfig,
  mainnetNetworkConfig,
} from 'sarcophagus-v2-sdk';

export const networkConfigs: { [chainId: number]: NetworkConfig } = {
  1: mainnetNetworkConfig,
  5: goerliNetworkConfig,
  11155111: sepoliaNetworkConfig,
  31337: hardhatNetworkConfig,
};
