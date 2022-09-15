import { readContract } from 'wagmi/actions';
import { ViewStateFacet } from 'lib/abi/ViewStateFacet';
import { useNetworkConfig } from 'lib/config';
import { ArchaeologistProfile } from 'types';
import { useAsyncEffect } from 'hooks/useAsyncEffect';
import { useDispatch, useSelector } from '../../store';
import { storeArchaeologists } from 'store/archaeologist/actions';

export function useGetArchaeologistProfiles() {
  const networkConfig = useNetworkConfig();
  const dispatch = useDispatch();
  const storedArchaeologists = useSelector(s => s.archaeologistState.archaeologists);

  let profiles: Record<string, ArchaeologistProfile> = {};

  useAsyncEffect(async () => {
    if (storedArchaeologists.length > 0) return;

    const addresses = await readContract({
      addressOrName: networkConfig.diamondDeployAddress,
      contractInterface: ViewStateFacet.abi,
      functionName: 'getArchaeologistProfileAddresses',
    });

    if (addresses) {
      // TODO: Having to do single use `readContract`s in a loop because `useContractReads` does not work in hardhat
      for await (const addr of addresses) {
        const profile = await readContract({
          addressOrName: networkConfig.diamondDeployAddress,
          contractInterface: ViewStateFacet.abi,
          functionName: 'getArchaeologistProfile',
          args: [addr],
        });

        if (profile) {
          profiles[addr] = {
            archAddress: addr,
            exists: profile.exists,
            minimumDiggingFee: profile.minimumDiggingFee,
            maximumRewrapInterval: profile.maximumRewrapInterval,
            peerId: profile.peerId,
          };
        }
      }

      const archaeologists = Object.values(profiles).map(p => ({ profile: p, isOnline: false }));
      dispatch(storeArchaeologists(archaeologists));
    }
  }, []);
}
