import { NetworkConfig } from './networkConfigType';
import { tokenAddresses } from './contract_addresses';

const chainId = 31337;

export const goerliNetworkConfig: NetworkConfig = {
  chainId: chainId,
  networkName: 'Goerli Testnet',
  networkShortName: 'Goerli',
  sarcoTokenAddress: '0x4633b43990b41B57b3678c6F3Ac35bA75C3D8436',
  diamondDeployAddress: '0x814De2Db5D12E7e10B79D128Fca70Baba53d8394',
  bundlr: {
    currencyName: 'ethereum',
    nodeUrl: 'https://devnet.bundlr.network',
    providerUrl: 'https://rpc.ankr.com/eth_goerli',
  },
};
