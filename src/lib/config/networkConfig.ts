import { NetworkConfig } from './networkConfigType';
import { hardhatNetworkConfig } from './hardhat';

export const supportedNetworkConfigs: { [chainId: number]: NetworkConfig } = {
  // TODO: Uncomment lines below as support expands (or as needed locally, but keep untracked)
  // 1: mainnetNetworkConfig,
  // 5: goerliNetworkConfig,
  31337: hardhatNetworkConfig,
  // 137: maticNetworkConfig,
};
