import { uploadPriceDecimals } from 'lib/constants';
import { useEffect, useMemo, useState } from 'react';
import { setUploadPrice } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { useNetwork } from 'wagmi';
import { BigNumber } from 'bignumber.js';

export function useUploadPrice() {
  const dispatch = useDispatch();
  const { bundlr, isConnected } = useSelector(x => x.bundlrState);
  const { chain } = useNetwork();
  const file = useSelector(x => x.embalmState.file);
  const uploadPrice = useSelector(x => x.embalmState.uploadPrice);
  const [uploadPriceBN, setUploadPriceBN] = useState(BigNumber(0));

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
      // to be used in the conditional operator to display estimated payload price
      setUploadPriceBN(paddedPrice);
      const convertedPrice = bundlr.utils.unitConverter(paddedPrice);
      dispatch(setUploadPrice(convertedPrice.toString()));
    })();
  }, [bundlr, dispatch, file]);

  return { uploadPrice, formattedUploadPrice, uploadPriceBN };
}
