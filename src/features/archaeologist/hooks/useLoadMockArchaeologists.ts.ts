import { useAsyncEffect } from '../../../hooks/useAsyncEffect';
import { useDispatch, useSelector } from '../../../store';
import { startLoad, stopLoad } from '../../../store/app/actions';
import { storeArchaeologists } from '../../../store/archaeologist/actions';
import { generateMockArchaeologists } from '../../../utils/generateMockArchaeologists';

export function useLoadMockArchaeologists() {
  const dispatch = useDispatch();
  const archaeologists = useSelector(s => s.archaeologistState.archaeologists);

  useAsyncEffect(async () => {
    // Only generate archaeologists if there are none
    if (archaeologists.length === 0) {
      try {
        dispatch(startLoad());
        const mockArchaeologists = await generateMockArchaeologists(3);

        dispatch(storeArchaeologists(mockArchaeologists));
      } catch (error) {
        // TODO: Implement better error handling
        console.error(error);
      } finally {
        dispatch(stopLoad());
      }
    }
  }, []);
}
