import { LibP2pContext } from 'lib/network/P2PNodeProvider';
import { useContext } from 'react';
import { startLoad, stopLoad } from 'store/app/actions';
import { useAsyncEffect } from '../../../hooks/useAsyncEffect';
import { useDispatch } from '../../../store';
import { storeArchaeologists } from '../../../store/archaeologist/actions';
import { Archaeologist } from '../../../types';
import { initialisePeerDiscovery } from '../discovery';

export function useLoadArchaeologists() {
  const dispatch = useDispatch();

  const browserNode = useContext(LibP2pContext);

  useAsyncEffect(async () => {
    try {
      dispatch(startLoad());
      const archaeologists: Archaeologist[] = [];

      if (browserNode === undefined) {
        console.error('browser node is undefined');
        return;
      }

      await initialisePeerDiscovery(
        await browserNode,
        (discoveredArchs: Archaeologist[]) => dispatch(storeArchaeologists(discoveredArchs))
      );

      dispatch(storeArchaeologists(archaeologists));
    } catch (error) {
      // TODO: Implement better error handling
      console.error(error);
    } finally {
      dispatch(stopLoad());
    }
  }, []);
}
