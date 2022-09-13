import { useGetArchaeologistProfiles } from 'hooks/viewStateFacet';
import { LibP2pContext } from 'lib/network/P2PNodeProvider';
import { useContext } from 'react';
import { useAsyncEffect } from '../../../hooks/useAsyncEffect';
import { useDispatch } from '../../../store';
import { storeArchaeologists, selectArchaeologist } from '../../../store/archaeologist/actions';
import { Archaeologist } from '../../../types';
import { initialisePeerDiscovery } from '../discovery';

export function useLoadArchaeologists() {
  const dispatch = useDispatch();

  useGetArchaeologistProfiles();

  const browserNode = useContext(LibP2pContext);
  useAsyncEffect(async () => {
    try {
      if (browserNode === undefined) {
        console.error('browser node is undefined');
        return;
      }

      await initialisePeerDiscovery(
        await browserNode, {
        setArchs: (discoveredArchs: Archaeologist[]) => dispatch(storeArchaeologists(discoveredArchs)),
        onArchConnected: (connectedArc: Archaeologist) => dispatch(selectArchaeologist(connectedArc)),
      }
      );
    } catch (error) {
      // TODO: Implement better error handling
      console.error(error);
    }
  }, []);
}
