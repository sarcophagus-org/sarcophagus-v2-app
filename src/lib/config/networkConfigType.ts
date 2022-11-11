export interface BundlrConfig {
  currencyName: string;
  nodeUrl: string;
  providerUrl: string;
}

interface ArweaveConfig {
  host: string;
  port: number;
  protocol: 'http' | 'https';
  timeout: number;
  logging: boolean;
}

export interface NetworkConfig {
  chainId: number;
  networkName: string;
  networkShortName: string;
  sarcoTokenAddress: string;
  diamondDeployAddress: string;
  explorerUrl: string;
  explorerApiKey: string;
  bundlr: BundlrConfig;
  arweaveConfig: ArweaveConfig;
}
