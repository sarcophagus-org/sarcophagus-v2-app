import { NetworkConfig } from './networkConfigType';
import {
  goerliNetworkConfig,
  hardhatNetworkConfig,
  mainnetNetworkConfig,
  sepoliaNetworkConfig,
  polygonMumbaiNetworkConfig,
  baseGoerliNetworkConfig,
  MAINNET_CHAIN_ID,
  GOERLI_CHAIN_ID,
  SEPOLIA_CHAIN_ID,
  HARDHAT_CHAIN_ID,
  BASE_GOERLI_CHAIN_ID,
  POLYGON_MUMBAI_CHAIN_ID,
} from '@sarcophagus-org/sarcophagus-v2-sdk-client';

export const emptyConfig: NetworkConfig = {
  chainId: 0,
  networkName: '',
  networkShortName: '',
  sarcoTokenAddress: '',
  tokenSymbol: '',
  diamondDeployAddress: '',
  explorerUrl: '',
  etherscanApiUrl: '',
  etherscanApiKey: '',
  providerUrl: '',
  apiUrlBase: '',
  bundlr: {
    currencyName: '',
    nodeUrl: '',
  },
  arweaveConfig: {
    host: '',
    port: 0,
    protocol: 'https',
    timeout: 0,
    logging: false,
  },
  subgraphUrl: '',
};

export const networkConfigs: { [chainId: number]: NetworkConfig } = {
  [MAINNET_CHAIN_ID]: mainnetNetworkConfig(process.env.REACT_APP_MAINNET_PROVIDER!, {
    zeroExApiKey: process.env.REACT_APP_ZERO_EX_API_KEY!,
  }),
  [GOERLI_CHAIN_ID]: goerliNetworkConfig(process.env.REACT_APP_GOERLI_PROVIDER!, {
    zeroExApiKey: process.env.REACT_APP_ZERO_EX_API_KEY!,
  }),
  [SEPOLIA_CHAIN_ID]: sepoliaNetworkConfig(process.env.REACT_APP_SEPOLIA_PROVIDER!, {
    zeroExApiKey: process.env.REACT_APP_ZERO_EX_API_KEY!,
  }),
  [BASE_GOERLI_CHAIN_ID]: baseGoerliNetworkConfig(process.env.REACT_APP_BASE_GOERLI_PROVIDER!, {
    zeroExApiKey: process.env.REACT_APP_ZERO_EX_API_KEY!,
  }),
  [POLYGON_MUMBAI_CHAIN_ID]: polygonMumbaiNetworkConfig(
    process.env.REACT_APP_POLYGON_MUMBAI_PROVIDER!,
    {
      zeroExApiKey: process.env.REACT_APP_ZERO_EX_API_KEY!,
    }
  ),
  [HARDHAT_CHAIN_ID]: hardhatNetworkConfig(),
};
