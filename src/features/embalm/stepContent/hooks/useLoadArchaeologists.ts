import { ViewStateFacet } from 'lib/abi/ViewStateFacet';
import { useNetworkConfig } from 'lib/config';
import { useEffect } from 'react';
import { startLoad, stopLoad } from 'store/app/actions';
import { setArchaeologists } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { ArchaeologistProfile } from 'types';
import { readContract } from 'wagmi/actions';

/**
 * Loads archaeologist profiles from the sarcophagus contract
 */
export function useLoadArchaeologists() {
  const dispatch = useDispatch();
  const networkConfig = useNetworkConfig();
  const { archaeologists } = useSelector(s => s.embalmState);

  useEffect(() => {
    (async () => {
      try {
        // Only load the archaeologists once when the component mounts. The only reason the
        // archaeologists would need to be loaded from the contract again is when a new
        // archaeologist registers.
        if (archaeologists.length > 0) return;
        dispatch(startLoad());

        let profiles: Record<string, ArchaeologistProfile> = {};

        const addresses: string[] = await readContract({
          addressOrName: networkConfig.diamondDeployAddress,
          contractInterface: ViewStateFacet.abi,
          functionName: 'getArchaeologistProfileAddresses',
        });

        if (addresses?.length !== 0) {
          // TODO: Having to do single use `readContract`s in a loop because `useContractReads` does not work in hardhat
          for await (const addr of addresses) {
            const profile: ArchaeologistProfile = await readContract({
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
                signature: { v: 0, r: '', s: '' }, // TODO Update with signature from profile
              };
            }
          }

          const newArchaeologists = Object.values(profiles).map(p => ({
            profile: p,
            isOnline: false,
          }));
          dispatch(setArchaeologists(newArchaeologists));
        }
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(stopLoad());
      }
    })();
  }, [archaeologists, dispatch, networkConfig.diamondDeployAddress]);
}
