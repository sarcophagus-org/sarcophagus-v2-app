import { NetworkConfig } from './networkConfigType';
import { mainnetNetworkConfig } from './mainnet';
import { gorliNetworkConfig } from './gorli';
import { hardhatNetworkConfig } from './hardhat';

export const AllNetworkConfigs: { [chainId: number]: NetworkConfig } = {
  1: mainnetNetworkConfig,
  5: gorliNetworkConfig,
  31337: hardhatNetworkConfig,
};

//export const networkConfig = AllNetworkConfigs[chain.id];
