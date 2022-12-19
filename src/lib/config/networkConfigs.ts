import { NetworkConfig } from './networkConfigType';
import { hardhatNetworkConfig } from './hardhat';
import { mainnetNetworkConfig } from './mainnet';
import { goerliNetworkConfig } from './goerli';
import { sepoliaNetworkConfig } from './sepolia';

export const networkConfigs: { [chainId: number]: NetworkConfig } = {
  1: mainnetNetworkConfig,
  5: goerliNetworkConfig,
  11155111: sepoliaNetworkConfig,
  31337: hardhatNetworkConfig,
};
