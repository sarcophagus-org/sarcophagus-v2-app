import { ViewStateFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { BigNumber } from 'ethers';
import { useNetworkConfig } from 'lib/config';
import { Sarcophagus } from 'types';
import { useAccount, useContractRead } from 'wagmi';
import { useGetGracePeriod } from './useGetGracePeriod';

/**
 * Uses `embalmerClaimWindow` from the contracts to check if the connected account can clean the
 * sarcophagus. Returns `false` if the connected account is not the embalmer of the sarcophagus.
 */
export function useGetEmbalmerCanClean(sarcophagus: Sarcophagus | undefined): boolean {
  const networkConfig = useNetworkConfig();
  const gracePeriod = useGetGracePeriod();

  const { data } = useContractRead({
    address: networkConfig.diamondDeployAddress,
    abi: ViewStateFacet__factory.abi,
    functionName: 'getEmbalmerClaimWindow',
  });

  const { address } = useAccount();

  if (!data) return false;
  if (!sarcophagus || !sarcophagus.hasLockedBond) return false;
  if (sarcophagus.embalmerAddress !== address) return false;

  const sarcoResurrectionTime = Number.parseInt(sarcophagus.resurrectionTime.toString());
  const cleanWindow = Number.parseInt((data as BigNumber).toString());
  const nowSeconds = Math.trunc(Date.now() / 1000);

  const sarcoGracePeriod = sarcoResurrectionTime + gracePeriod;
  const isWithinCleanWindow =
    nowSeconds > sarcoGracePeriod && nowSeconds < sarcoGracePeriod + cleanWindow;

  return isWithinCleanWindow;
}
