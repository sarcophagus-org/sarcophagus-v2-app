import { NetworkConfig } from './networkConfigType';
import { hardhatNetworkConfig } from './hardhat';
import {
  goerliNetworkConfig,
  mainnetNetworkConfig,
  sepoliaNetworkConfig,
} from 'sarcophagus-v2-sdk';

export const networkConfigs: { [chainId: number]: NetworkConfig } = {
  1: mainnetNetworkConfig(
    process.env.REACT_APP_BUNDLR_GOERLI_PROVIDER!,
    process.env.REACT_APP_INFURA_API_KEY!
  ),
  5: goerliNetworkConfig(
    process.env.REACT_APP_BUNDLR_GOERLI_PROVIDER!,
    process.env.REACT_APP_INFURA_API_KEY!
  ),
  11155111: sepoliaNetworkConfig(
    process.env.REACT_APP_BUNDLR_GOERLI_PROVIDER!,
    process.env.REACT_APP_INFURA_API_KEY!
  ),
  31337: hardhatNetworkConfig,
};
