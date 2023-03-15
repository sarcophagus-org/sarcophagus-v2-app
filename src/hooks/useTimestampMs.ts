import { useCallback, useEffect } from 'react';
import { useDispatch } from 'store/index';
import { setTimestampMs } from 'store/app/actions';
import { useProvider } from 'wagmi';

export function useTimestampMs() {
  const provider = useProvider();
  const dispatch = useDispatch();

  const getTimestampMs = useCallback(async () => {
    const blockNumber = await provider.getBlockNumber();
    const block = await provider.getBlock(blockNumber);
    dispatch(setTimestampMs(block.timestamp * 1000));
  }, [dispatch, provider]);

  useEffect(() => {
    getTimestampMs();
  }, [getTimestampMs]);
}
