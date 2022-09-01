import { uploadPriceDecimals } from 'lib/constants';
import { useEffect, useMemo } from 'react';
import { setUploadPrice } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { useNetwork } from 'wagmi';

export function useUploadPrice() {
  const dispatch = useDispatch();
  const { bundlr, isConnected } = useSelector(x => x.bundlrState);
  const { chain } = useNetwork();
  const file = useSelector(x => x.embalmState.file);
  const uploadPrice = useSelector(x => x.embalmState.uploadPrice);

  const formattedUploadPrice = useMemo(
    () =>
      isConnected
        ? `${parseFloat(uploadPrice).toFixed(uploadPriceDecimals)} ${chain?.nativeCurrency?.name}`
        : '',
    [chain, isConnected, uploadPrice]
  );

  // Updates the upload price when the file changes
  useEffect(() => {
    (async () => {
      if (!file || !bundlr) return;
      const price = await bundlr.getPrice(file.size);
      if (!price) return;
      const convertedPrice = bundlr.utils.unitConverter(price);
      console.log('difference');
      dispatch(setUploadPrice(convertedPrice.toString()));
    })();
  }, [bundlr, dispatch, file]);

  return { uploadPrice, formattedUploadPrice };
}
