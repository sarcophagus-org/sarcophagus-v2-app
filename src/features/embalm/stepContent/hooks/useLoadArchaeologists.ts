import { useAsyncEffect } from 'hooks/useAsyncEffect';
import { generateMockArchaeoloigsts } from 'lib/mocks/mockArchaeologists';
import { LibP2pContext } from 'lib/network/P2PNodeProvider';
import { useContext, useEffect } from 'react';
import { startLoad, stopLoad } from 'store/app/actions';
import { setArchaeologists, setSelectedArchaeologists } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { Archaeologist } from 'types/index';

export function useLoadArchaeologists() {
  const dispatch = useDispatch();
  const { archaeologists, selectedArchaeologists } = useSelector(s => s.embalmState);

  const browserNode = useContext(LibP2pContext);

  useEffect(() => {
    (async () => {
      try {
        dispatch(startLoad());
        const loadedArchaeologists: Archaeologist[] = generateMockArchaeoloigsts();

        // TODO: Temporarily remove this and load mock archaeologists
        // if (browserNode === undefined) {
        //   console.error('browser node is undefined');
        //   return;
        // }

        // await initialisePeerDiscovery(await browserNode, (discoveredArchs: Archaeologist[]) =>
        //   dispatch(setArchaeologists(discoveredArchs))
        // );

        dispatch(setArchaeologists(loadedArchaeologists));

        // TODO: Remove this when we load real archaeologiss
        // Resets selected archaeologists.
        // This only exists because new mock archaeoloigsts are being generated ealier in this
        // useEffect.
        dispatch(setSelectedArchaeologists([]));
      } catch (error) {
        // TODO: Implement better error handling
        console.error(error);
      } finally {
        dispatch(stopLoad());
      }
    })();
  }, [browserNode, dispatch]);

  useAsyncEffect(async () => {}, []);

  return { archaeologists, selectedArchaeologists };
}
