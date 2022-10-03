import { ViewStateFacet } from 'lib/abi/ViewStateFacet';
import { useNetworkConfig } from 'lib/config';
import { useEffect } from 'react';
import { startLoad, stopLoad } from 'store/app/actions';
import { setArchaeologists } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
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

        const addresses: string[] = await readContract({
          addressOrName: networkConfig.diamondDeployAddress,
          contractInterface: ViewStateFacet.abi,
          functionName: 'getArchaeologistProfileAddresses',
        });

        if (!addresses || addresses.length === 0) return;

        const profiles = await readContract({
          addressOrName: networkConfig.diamondDeployAddress,
          contractInterface: ViewStateFacet.abi,
          functionName: 'getArchaeologistProfiles',
          args: [addresses],
        });

        const stats = await readContract({
          addressOrName: networkConfig.diamondDeployAddress,
          contractInterface: ViewStateFacet.abi,
          functionName: 'getArchaeologistsStatistics',
          args: [addresses],
        });

        const newArchaeologists = profiles.map((p, i) => ({
          profile: {
            ...p,
            archAddress: addresses[i],
            successes: stats[i].successes,
            cancels: stats[i].cancels,
            accusals: stats[i].accusals,
          },
          isOnline: false,
        }));
        dispatch(setArchaeologists(newArchaeologists));
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(stopLoad());
      }
    })();
  }, [archaeologists, dispatch, networkConfig.diamondDeployAddress]);
}
