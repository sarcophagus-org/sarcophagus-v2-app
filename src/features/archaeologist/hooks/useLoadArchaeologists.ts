import { useGetArchaeologistProfiles } from 'hooks/viewStateFacet/useGetArchaeologistProfiles';
import { LibP2pContext } from 'lib/network/P2PNodeProvider';
import { useContext } from 'react';
import { selectArchaeologist, setArchaeologists } from 'store/embalm/actions';
import { useAsyncEffect } from '../../../hooks/useAsyncEffect';
import { useDispatch, useSelector } from '../../../store';
import { Archaeologist } from '../../../types';
import { initialisePeerDiscovery } from '../discovery';

export function useLoadArchaeologists() {
  const dispatch = useDispatch();

  useGetArchaeologistProfiles();

  const storedArchaeologists = useSelector(s => s.embalmState.archaeologists);

  const browserNodePromise = useContext(LibP2pContext);
  useAsyncEffect(async () => {
    try {
      console.log('storedArchaeologists', storedArchaeologists);

      if (browserNodePromise === undefined) {
        console.error('browser node is undefined');
        return;
      }

      if (storedArchaeologists.length > 0) {
        await initialisePeerDiscovery(await browserNodePromise, storedArchaeologists, {
          setArchs: (discoveredArchs: Archaeologist[]) =>
            dispatch(setArchaeologists(discoveredArchs)),
          onArchConnected: (connectedArc: Archaeologist) =>
            dispatch(selectArchaeologist(connectedArc)),
        });
      }
    } catch (error) {
      // TODO: Implement better error handling
      console.error(error);
    }
  }, [storedArchaeologists]);
}
