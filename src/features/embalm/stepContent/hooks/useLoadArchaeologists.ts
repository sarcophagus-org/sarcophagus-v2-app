import { ViewStateFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import axios from 'axios';
import { useNetworkConfig } from 'lib/config';
import { useCallback, useEffect, useState } from 'react';
import { startLoad, stopLoad } from 'store/app/actions';
import { setArchaeologists, setCurrentChainId } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { Archaeologist } from 'types';
import { useNetwork } from 'wagmi';
import { readContract } from 'wagmi/actions';

/**
 * Loads archaeologist profiles from the sarcophagus contract
 */
export function useLoadArchaeologists() {
  const dispatch = useDispatch();
  const networkConfig = useNetworkConfig();
  const { archaeologists, currentChainId } = useSelector(s => s.embalmState);
  const { libp2pNode } = useSelector(s => s.appState);
  const { chain } = useNetwork();
  const [isProfileLoading, setIsProfileLoading] = useState<boolean | undefined>(undefined);

  const getFullArchProfilesFromAddresses = useCallback(
    async (addresses: string[]): Promise<Archaeologist[]> => {
      if (addresses.length === 0) return [];

      const profiles = (await readContract({
        address: networkConfig.diamondDeployAddress,
        abi: ViewStateFacet__factory.abi,
        functionName: 'getArchaeologistProfiles',
        args: [addresses],
      })) as any[];

      const stats = (await readContract({
        address: networkConfig.diamondDeployAddress,
        abi: ViewStateFacet__factory.abi,
        functionName: 'getArchaeologistsStatistics',
        args: [addresses],
      })) as any[];

      const registeredArchaeologists = profiles.map((p, i) => ({
        profile: {
          ...p,
          archAddress: addresses[i],
          successes: stats[i].successes,
          cleanups: stats[i].cleanups,
          accusals: stats[i].accusals,
          failures: stats[i].failures,
        },
        isOnline: false,
      }));

      const res = await axios.get(`${process.env.REACT_APP_ARCH_MONITOR}/online-archaeologists`);
      const onlinePeerIds = res.data;

      for (let arch of registeredArchaeologists) {
        if (onlinePeerIds.includes(arch.profile.peerId)) {
          arch.isOnline = true;
        }
      }

      return registeredArchaeologists;
    },
    [networkConfig.diamondDeployAddress]
  );

  const refreshProfiles = useCallback(
    async (addresses: string[]) => {
      if (!networkConfig.diamondDeployAddress) {
        return [];
      }

      if (addresses.length === 0) return [];

      try {
        return await getFullArchProfilesFromAddresses(addresses);
      } catch (e) {
        console.error(e);
        return [];
      }
    },
    [getFullArchProfilesFromAddresses, networkConfig.diamondDeployAddress]
  );

  const getRegisteredProfiles = useCallback(async (): Promise<Archaeologist[]> => {
    if (!networkConfig.diamondDeployAddress) {
      return [];
    }

    const addresses: string[] = (await readContract({
      address: networkConfig.diamondDeployAddress,
      abi: ViewStateFacet__factory.abi,
      functionName: 'getArchaeologistProfileAddresses',
    })) as string[];

    if (!addresses || addresses.length === 0) return [];

    return getFullArchProfilesFromAddresses(addresses);
  }, [getFullArchProfilesFromAddresses, networkConfig.diamondDeployAddress]);

  // This useEffect is used to trigger the other useEffect below once
  // the dependencies are ready
  useEffect(() => {
    if (!!chain?.id && !!dispatch && !!getRegisteredProfiles && !!libp2pNode) {
      setIsProfileLoading(false);
    }
  }, [chain?.id, dispatch, getRegisteredProfiles, libp2pNode]);

  useEffect(() => {
    if (isProfileLoading === undefined) return;

    // Only load the archaeologists once when the component mounts. The only reason the
    // archaeologists would need to be loaded from the contract again is when a new
    // archaeologist registers.
    //
    // Additionally we will reload the archaeologist on network switch.
    if (
      !libp2pNode ||
      isProfileLoading ||
      (archaeologists.length > 0 && currentChainId === chain?.id)
    )
      return;

    setIsProfileLoading(true);

    (async () => {
      try {
        dispatch(startLoad());
        dispatch(setCurrentChainId(chain?.id));

        const newArchaeologists = await getRegisteredProfiles();
        if (newArchaeologists) {
          dispatch(setArchaeologists(newArchaeologists));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsProfileLoading(false);
        dispatch(stopLoad());
      }
    })();
  }, [
    archaeologists.length,
    chain?.id,
    currentChainId,
    dispatch,
    getRegisteredProfiles,
    libp2pNode,
    isProfileLoading,
  ]);

  return { refreshProfiles };
}
