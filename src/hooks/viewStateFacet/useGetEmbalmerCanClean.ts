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
  if (!sarcophagus) return false;
  if (sarcophagus.embalmerAddress !== address) return false;

  const cleanWindow = BigNumber.from(data).toNumber();
  const nowSeconds = Math.trunc(Date.now() / 1000);

  // Embalmer can clean the sarcophagus if there's still locked bond to be claimed because not all archaeologists unwrapped before grace period,
  // AND if still within the clean window.
  const isEmbalmerCleanable =
    sarcophagus.publishedKeyShareCount < sarcophagus.archaeologistAddresses.length &&
    sarcophagus.hasLockedBond;

  const sarcoGracePeriod = sarcophagus.resurrectionTime.toNumber() + gracePeriod;
  const isWithinCleanWindow =
    nowSeconds > sarcoGracePeriod && nowSeconds < sarcoGracePeriod + cleanWindow;

  return isEmbalmerCleanable && isWithinCleanWindow;
}
