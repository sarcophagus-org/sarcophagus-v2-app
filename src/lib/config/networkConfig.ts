import { NetworkConfig } from './networkConfigType';
import { mainnetNetworkConfig } from './mainnet';
import { goerliNetworkConfig } from './goerli';
import { hardhatNetworkConfig } from './hardhat';
import { maticNetworkConfig } from './matic';

export const supportedNetworkConfigs: { [chainId: number]: NetworkConfig } = {
  1: mainnetNetworkConfig,
  5: goerliNetworkConfig,
  31337: hardhatNetworkConfig,
  137: maticNetworkConfig,
};
