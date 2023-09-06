import { useNetworkConfig } from 'lib/config';
import { useCallback, useEffect, useState } from 'react';
import { startLoad, stopLoad } from 'store/app/actions';
import { setArchaeologists, setCurrentChainId } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { useNetwork, useSigner } from 'wagmi';
import * as Sentry from '@sentry/react';

import { ArchaeologistData, sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';
import { useSupportedNetwork } from 'lib/config/useSupportedNetwork';

/**
 * Loads archaeologist profiles from the sarcophagus contract
 */
export function useLoadArchaeologists() {
  const dispatch = useDispatch();
  const networkConfig = useNetworkConfig();
  const { archaeologists, currentChainId } = useSelector(s => s.embalmState);
  const { timestampMs } = useSelector(s => s.appState);
  const { chain } = useNetwork();
  const [isArchsLoaded, setIsArchsLoaded] = useState<boolean>(false);
  const [isDependenciesReady, setIsDependenciesReady] = useState<boolean>(false);

  const { data: signer } = useSigner();
  const { isSarcoInitialized } = useSupportedNetwork();

  const refreshProfiles = useCallback(
    async (addresses: string[]): Promise<ArchaeologistData[]> => {
      if (!networkConfig.diamondDeployAddress || !isSarcoInitialized) {
        return [];
      }

      if (addresses.length === 0) return [];

      try {
        return await sarco.archaeologist.getFullArchProfiles({ addresses, filterOffline: true });
      } catch (e) {
        console.log('error loading archs', e);
        Sentry.captureException(e, { fingerprint: ['LOAD_ARCHAEOLOGISTS_FAILURE'] });
        return [];
      }
    },
    [isSarcoInitialized, networkConfig.diamondDeployAddress]
  );

  const getRegisteredProfiles = useCallback(async (): Promise<ArchaeologistData[]> => {
    if (!networkConfig.diamondDeployAddress || !signer) {
      return [];
    }

    try {
      return await sarco.archaeologist.getFullArchProfiles({ filterOffline: true });
    } catch (e) {
      console.log('error loading archs', e);
      Sentry.captureException(e, { fingerprint: ['LOAD_ARCHAEOLOGISTS_FAILURE'] });
      return [];
    }
  }, [networkConfig, signer]);

  // This useEffect is used to trigger the useEffect below to load archaeologists once
  // ALL dependencies are ready.
  useEffect(() => {
    if (
      !!chain?.id &&
      !!dispatch &&
      !!getRegisteredProfiles &&
      !!networkConfig.diamondDeployAddress &&
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
    networkConfig.diamondDeployAddress,
    signer,
    timestampMs,
  ]);

  useEffect(() => {
    // Only load the archaeologists once, when the component mounts.
    if (!isDependenciesReady) {
      return;
    }

    // The only reason the archaeologists would need to be loaded from the contract again is when a new
    // archaeologist registers.
    if (isArchsLoaded || (archaeologists.length > 0 && currentChainId === chain?.id)) {
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
    isDependenciesReady,
    isArchsLoaded,
  ]);

  return { refreshProfiles };
}
