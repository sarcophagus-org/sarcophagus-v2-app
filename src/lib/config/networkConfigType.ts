import { ApiConfig as ArweaveConfig } from 'arweave/node/lib/api';

export interface BundlrConfig {
  currencyName: string;
  nodeUrl: string;
  providerUrl: string;
}

export interface NetworkConfig {
  chainId: number;
  networkName: string;
  networkShortName: string;
  sarcoTokenAddress: string;
  diamondDeployAddress: string;
  etherscanApiUrl: string;
  explorerUrl: string;
  etherscanApiKey: string;
  bundlr: BundlrConfig;
  arweaveConfig: ArweaveConfig;
}
