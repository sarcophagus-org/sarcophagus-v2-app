import { NetworkConfig } from './networkConfigType';
import { hardhatNetworkConfig } from './hardhat';
import { mainnetNetworkConfig } from './mainnet';
import { goerliNetworkConfig } from './goerli';
import { maticNetworkConfig } from './matic';

export const networkConfigs: { [chainId: number]: NetworkConfig } = {
  1: mainnetNetworkConfig,
  5: goerliNetworkConfig,
  31337: hardhatNetworkConfig,
  137: maticNetworkConfig,
};
