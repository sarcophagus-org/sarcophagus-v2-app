import { providers } from 'ethers';
import { NetworkConfig } from 'lib/config/networkConfigType';

// The contracts block number deployed on goerli as of 3/21/23
// This is intended to be used as a fallback in case the etherscan api call fails
const defaultBlockNumber = 8526154;

async function getContractDeploymentBlockNumber(
  provider: providers.Provider,
  networkConfig: NetworkConfig
): Promise<number> {
  const code = await provider.getCode(networkConfig.diamondDeployAddress);

  if (code === '0x') {
    throw new Error('Contract not found at the provided address.');
  }

  const network = await provider.getNetwork();
  const url = `https://api${
    network.chainId === 1 ? '' : `-${network.name}`
  }.etherscan.io/api?module=account&action=txlist&address=${
    networkConfig.diamondDeployAddress
  }&startblock=0&endblock=99999999&sort=asc&apikey=${networkConfig.etherscanApiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== '1' || data.result.length === 0) {
      throw new Error('Contract creation transaction not found.');
    }

    const txHash = data.result[0].hash;
    const receipt = await provider.getTransactionReceipt(txHash);

    if (!receipt) {
      throw new Error('Contract deployment receipt not found.');
    }

    return receipt.blockNumber;
  } catch (error) {
    console.error(
      `Unable to get the block number the contract was deployed on. Defaulting to ${defaultBlockNumber}`
    );
    return defaultBlockNumber;
  }
}

export function getBlockNumberLocalStorageKey(networkConfig: NetworkConfig) {
  return `contractDeploymentBlockNumber_${networkConfig.chainId}_${networkConfig.diamondDeployAddress}`;
}

export async function storeDeploymentBlockNumber(
  provider: providers.Provider,
  networkConfig: NetworkConfig
) {
  const localStorageKey = getBlockNumberLocalStorageKey(networkConfig);

  if (localStorage.getItem(localStorageKey)) {
    return;
  }

  const blockNumber = await getContractDeploymentBlockNumber(provider, networkConfig);
  localStorage.setItem(localStorageKey, blockNumber.toString());
}
