import { ViewStateFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useNetworkConfig } from 'lib/config';
import { useCallback, useEffect } from 'react';
import { startLoad, stopLoad } from 'store/app/actions';
import { setArchaeologists, setCurrentChainId } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { useNetwork } from 'wagmi';
import { readContract } from 'wagmi/actions';

/**
 * Loads archaeologist profiles from the sarcophagus contract
 */
export function useLoadArchaeologists() {
  const dispatch = useDispatch();
  const networkConfig = useNetworkConfig();
  const { archaeologists, currentChainId } = useSelector(s => s.embalmState);
  const { chain } = useNetwork();

  const getProfiles = useCallback(async () => {
    const addresses: string[] = (await readContract({
      address: networkConfig.diamondDeployAddress,
      abi: ViewStateFacet__factory.abi,
      functionName: 'getArchaeologistProfileAddresses',
    })) as string[];

    if (!addresses || addresses.length === 0) return [];

    const profiles = (await readContract({
      address: networkConfig.diamondDeployAddress,
      abi: ViewStateFacet__factory.abi,
      functionName: 'getArchaeologistProfiles',
      args: [addresses],
    })) as any[]; // TODO: Update ABI packages to export const JSON objects instead, then remove these any[]s so wagmi can infer types

    const stats = (await readContract({
      address: networkConfig.diamondDeployAddress,
      abi: ViewStateFacet__factory.abi,
      functionName: 'getArchaeologistsStatistics',
      args: [addresses],
    })) as any[];

    return profiles.map((p, i) => ({
      profile: {
        ...p,
        archAddress: addresses[i],
        successes: stats[i].successes,
        cleanups: stats[i].cleanups,
        accusals: stats[i].accusals,
        failures: stats[i].failures,
      },
      // TODO - temporarily list all archs that have domains as online
      // until discovery for archs using websockets is updated
      isOnline: p.peerId.includes(':'),
    }));
  }, [networkConfig.diamondDeployAddress]);

  useEffect(() => {
    (async () => {
      try {
        // Only load the archaeologists once when the component mounts. The only reason the
        // archaeologists would need to be loaded from the contract again is when a new
        // archaeologist registers.
        //
        // Additionally we will reload the archaeologist on network switch.
        if (archaeologists.length > 0 && currentChainId === chain?.id) return;

        dispatch(startLoad());
        dispatch(setCurrentChainId(chain?.id));

        const newArchaeologists = await getProfiles();
        dispatch(setArchaeologists(newArchaeologists));
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(stopLoad());
      }
    })();
  }, [archaeologists.length, chain?.id, currentChainId, dispatch, getProfiles]);

  return { getProfiles };
}
