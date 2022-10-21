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
        ? `${parseFloat(uploadPrice || '0').toFixed(uploadPriceDecimals)} ${
            chain?.nativeCurrency?.name
          }`
        : '',
    [chain, isConnected, uploadPrice]
  );

  // Updates the upload price when the file changes
  useEffect(() => {
    (async () => {
      if (!file || !bundlr) return;
      const price = await bundlr.getPrice(file.size);
      if (!price) return;
      // pads the price slightly to prevent the user from underfunding
      const paddedPrice = price.multipliedBy(1.1);
      const convertedPrice = bundlr.utils.unitConverter(paddedPrice);
      dispatch(setUploadPrice(convertedPrice.toString()));
    })();
  }, [bundlr, dispatch, file]);

  return { uploadPrice, formattedUploadPrice };
}
