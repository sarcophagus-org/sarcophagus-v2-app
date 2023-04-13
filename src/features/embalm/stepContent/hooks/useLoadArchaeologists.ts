import { ViewStateFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useNetworkConfig } from 'lib/config';
import { useCallback, useEffect, useState } from 'react';
import { startLoad, stopLoad } from 'store/app/actions';
import { setArchaeologists, setCurrentChainId } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { Archaeologist } from 'types';
import { useContract, useNetwork, useSigner } from 'wagmi';
import * as Sentry from '@sentry/react';
import { useGraphQl } from 'hooks/useSubgraph';
import { BigNumber } from 'ethers';
import axios from "axios";

/**
 * Loads archaeologist profiles from the sarcophagus contract
 */
export function useLoadArchaeologists() {
  const dispatch = useDispatch();
  const networkConfig = useNetworkConfig();
  const { archaeologists, currentChainId } = useSelector(s => s.embalmState);
  const { libp2pNode, timestampMs } = useSelector(s => s.appState);
  const { chain } = useNetwork();
  const [isArchsLoaded, setIsArchsLoaded] = useState<boolean>(false);
  const [isDependenciesReady, setIsDependenciesReady] = useState<boolean>(false);

  const { getArchaeologists } = useGraphQl(Math.trunc(timestampMs / 1000));
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

        const archData = await getArchaeologists();

        const registeredArchaeologists = archData.map(arch => {
          const {
            successes,
            accusals,
            failures,
            address: archAddress,
            maximumResurrectionTime,
            freeBond,
            maximumRewrapInterval,
            minimumDiggingFeePerSecond,
            peerId,
            curseFee,
          } = arch;

          return {
            profile: {
              archAddress,
              peerId,
              successes: BigNumber.from(successes.length),
              accusals: BigNumber.from(accusals),
              failures: BigNumber.from(failures),
              maximumResurrectionTime: BigNumber.from(maximumResurrectionTime),
              freeBond: BigNumber.from(freeBond),
              maximumRewrapInterval: BigNumber.from(maximumRewrapInterval),
              minimumDiggingFeePerSecond: BigNumber.from(minimumDiggingFeePerSecond),
              curseFee: BigNumber.from(curseFee),
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
    [viewStateFacet, timestampMs, getArchaeologists]
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

  // This useEffect is used to trigger the useEffect below to load archaeologists once
  // ALL dependencies are ready.
  useEffect(() => {
    if (
      !!chain?.id &&
      !!dispatch &&
      !!getRegisteredProfiles &&
      !!libp2pNode &&
      !!networkConfig.diamondDeployAddress &&
      !!viewStateFacet &&
      !!signer &&
      !!timestampMs
    ) {
      setIsDependenciesReady(true);

      // Additionally we will reload the archaeologist on network switch.
      if (chain.id !== currentChainId) {
        setIsArchsLoaded(false);
      }
    }
  }, [
    chain?.id,
    currentChainId,
    dispatch,
    getRegisteredProfiles,
    libp2pNode,
    networkConfig.diamondDeployAddress,
    signer,
    timestampMs,
    viewStateFacet,
  ]);

  useEffect(() => {
    // Only load the archaeologists once, when the component mounts.
    if (!isDependenciesReady) {
      return;
    }

    // The only reason the archaeologists would need to be loaded from the contract again is when a new
    // archaeologist registers.
    if (
      !libp2pNode ||
      isArchsLoaded ||
      (archaeologists.length > 0 && currentChainId === chain?.id)
    ) {
      return;
    }

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
        setIsArchsLoaded(true);
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
    isDependenciesReady,
    isArchsLoaded,
  ]);

  return { refreshProfiles };
}
