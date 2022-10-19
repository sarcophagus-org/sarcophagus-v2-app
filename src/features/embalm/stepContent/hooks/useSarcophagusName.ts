import { setName } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { maxSarcophagusNameLength } from 'lib/constants';

export function useSarcophgusName() {
  const dispatch = useDispatch();
  const { name } = useSelector(x => x.embalmState);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (value.length > maxSarcophagusNameLength) {
      return;
    }

    dispatch(setName(value));
  }

  return { name, handleNameChange };
}
