import { ViewStateFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { BigNumber } from 'ethers';
import { useNetworkConfig } from 'lib/config';
import { Sarcophagus } from 'types';
import { useContractRead } from 'wagmi';
import { useGetGracePeriod } from './useGetGracePeriod';

export function useGetEmbalmerCanClean(sarcophagus: Sarcophagus | undefined): boolean {
  const networkConfig = useNetworkConfig();
  const gracePeriod = useGetGracePeriod();

  const { data } = useContractRead({
    address: networkConfig.diamondDeployAddress,
    abi: ViewStateFacet__factory.abi,
    functionName: 'getEmbalmerClaimWindow',
  });

  if (!data) return false;
  if (!sarcophagus) return false;

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
