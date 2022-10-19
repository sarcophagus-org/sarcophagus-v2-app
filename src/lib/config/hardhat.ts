import { contractAddresses, tokenAddresses } from './contract_addresses';
import { NetworkConfig } from './networkConfigType';

const chainId = 31337;

export const hardhatNetworkConfig: NetworkConfig = {
  chainId,
  networkName: 'Hardhat Local Network',
  networkShortName: 'HardHat',
  sarcoTokenAddress: tokenAddresses[chainId.toString()],
  diamondDeployAddress: contractAddresses[chainId.toString()],
  bundlr: {
    currencyName: 'ethereum',
    nodeUrl: 'https://devnet.bundlr.network',
    providerUrl: 'https://rpc.ankr.com/eth_goerli',
  },
};
