import { SarcoNetworkConfig } from '@sarcophagus-org/sarcophagus-v2-sdk-client';

export const emptyConfig: SarcoNetworkConfig = {
  chainId: 0,
  networkName: '',
  networkShortName: '',
  sarcoTokenAddress: '',
  tokenSymbol: '',
  diamondDeployAddress: '',
  explorerUrl: '',
  etherscanApiUrl: '',
  etherscanApiKey: '',
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
  zeroExApiUrl: '',
  zeroExSellToken: ''
};
