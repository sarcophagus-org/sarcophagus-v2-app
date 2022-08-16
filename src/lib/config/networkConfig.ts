import { NetworkConfig } from './networkConfigType';
import { mainnetNetworkConfig } from './mainnet';
import { goerliNetworkConfig } from './goerli';
import { hardhatNetworkConfig } from './hardhat';

export const AllNetworkConfigs: { [chainId: number]: NetworkConfig } = {
  1: mainnetNetworkConfig,
  5: goerliNetworkConfig,
  31337: hardhatNetworkConfig,
};
