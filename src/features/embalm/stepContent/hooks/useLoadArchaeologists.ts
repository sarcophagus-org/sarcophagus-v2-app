import { ViewStateFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
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
          address: networkConfig.diamondDeployAddress,
          abi: ViewStateFacet__factory.abi,
          functionName: 'getArchaeologistProfileAddresses',
        }) as string[];

        if (!addresses || addresses.length === 0) return;

        const profiles = await readContract({
          address: networkConfig.diamondDeployAddress,
          abi: ViewStateFacet__factory.abi,
          functionName: 'getArchaeologistProfiles',
          args: [addresses],
        }) as any[]; // TODO: Update ABI packages to export const JSON objects instead, then remove these any[]s so wagmi can infer types

        const stats = await readContract({
          address: networkConfig.diamondDeployAddress,
          abi: ViewStateFacet__factory.abi,
          functionName: 'getArchaeologistsStatistics',
          args: [addresses],
        }) as any[];

        const newArchaeologists = (profiles).map((p, i) => ({
          profile: {
            ...p,
            archAddress: addresses[i],
            successes: stats[i].successes,
            cleanups: stats[i].cleanups,
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
  }, [archaeologists, dispatch, networkConfig]);
}
