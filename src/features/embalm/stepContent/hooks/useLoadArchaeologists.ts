import { ViewStateFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import axios from 'axios';
import { useNetworkConfig } from 'lib/config';
import { useCallback, useEffect, useState } from 'react';
import { startLoad, stopLoad } from 'store/app/actions';
import { setArchaeologists, setCurrentChainId } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { Archaeologist } from 'types';
import { useContract, useNetwork, useSigner } from 'wagmi';
import * as Sentry from '@sentry/react';
import { ArchStatsSubgraph, useGraphQl } from 'hooks/useGraphQl';
import { BigNumber } from 'ethers';
import { useToast } from '@chakra-ui/react';
import { loadArchStatsError } from 'lib/utils/toast';

/**
 * Loads archaeologist profiles from the sarcophagus contract
 */
export function useLoadArchaeologists() {
  const dispatch = useDispatch();
  const networkConfig = useNetworkConfig();
  const { archaeologists, currentChainId } = useSelector(s => s.embalmState);
  const { libp2pNode, timestampMs } = useSelector(s => s.appState);
  const { chain } = useNetwork();
  const [isProfileLoading, setIsProfileLoading] = useState<boolean | undefined>(undefined);
  const toast = useToast();

  const { getStats } = useGraphQl(Math.trunc(timestampMs / 1000));
  const { data: signer } = useSigner();

  const viewStateFacet = useContract({
    address: networkConfig.diamondDeployAddress,
    abi: ViewStateFacet__factory.abi,
    signerOrProvider: signer,
  });

  const getFullArchProfilesFromAddresses = useCallback(
    async (addresses: string[]): Promise<Archaeologist[]> => {
      try {
        if (addresses.length === 0 || !viewStateFacet || !timestampMs) return [];
        const profiles: any[] = await viewStateFacet.callStatic.getArchaeologistProfiles(addresses);
        // const stats: any[] = await viewStateFacet.callStatic.getArchaeologistsStatistics(addresses);

        const statsData = await getStats();

        const registeredArchaeologists = profiles.map((p, i) => {
          const archStats: ArchStatsSubgraph = statsData.find(
            (a: any) => a.address.toLowerCase() === addresses[i].toLowerCase()
          )!;

          if (!archStats) {
            const errorData = loadArchStatsError();
            toast(errorData);
            Sentry.captureException(errorData.description);
            throw Error(errorData.description?.toString());
          }

          const { successes, accusals, failures } = archStats;

          return {
            profile: {
              ...p,
              archAddress: addresses[i],
              successes: BigNumber.from(successes),
              accusals: BigNumber.from(accusals),
              failures: BigNumber.from(failures),
            },
            isOnline: false,
          };
        });

        const res = await axios.get(`${process.env.REACT_APP_ARCH_MONITOR}/online-archaeologists`);
        const onlinePeerIds = res.data;

        for (let arch of registeredArchaeologists) {
          if (onlinePeerIds.includes(arch.profile.peerId)) {
            arch.isOnline = true;
          }
        }

        return registeredArchaeologists;
      } catch (e) {
        console.log('error loading archs', e);
        Sentry.captureException(e, { fingerprint: ['LOAD_ARCHAEOLOGISTS_FAILURE'] });
        return [];
      }
    },
    [viewStateFacet, timestampMs, getStats, toast]
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
    if (!networkConfig.diamondDeployAddress || !viewStateFacet || !signer) {
      return [];
    }

    const addresses: string[] = await viewStateFacet.callStatic.getArchaeologistProfileAddresses();

    if (!addresses || addresses.length === 0) return [];
    return getFullArchProfilesFromAddresses(addresses);
  }, [
    getFullArchProfilesFromAddresses,
    networkConfig.diamondDeployAddress,
    signer,
    viewStateFacet,
  ]);

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
