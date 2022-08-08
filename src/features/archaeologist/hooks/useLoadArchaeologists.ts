import { useAsyncEffect } from '../../../hooks/useAsyncEffect';
import { useDispatch } from '../../../store';
import { storeArchaeologists } from '../../../store/archaeologist/actions';
import { Archaeologist } from '../../../types';

export function useLoadArchaeologists() {
  const dispatch = useDispatch();

  useAsyncEffect(async () => {
    try {
      const archaeologists: Archaeologist[] = [];
      // TODO: Add function to load archaeologists

      dispatch(storeArchaeologists(archaeologists));
    } catch (error) {
      // TODO: Implement better error handling
      console.error(error);
    }
  }, []);
}
