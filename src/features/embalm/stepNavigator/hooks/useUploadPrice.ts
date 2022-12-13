import { BigNumber, ethers } from 'ethers';
import { uploadPriceDecimals } from 'lib/constants';
import { useEffect, useMemo } from 'react';
import { setUploadPrice } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { useNetwork } from 'wagmi';
import { BigNumber as BN } from 'bignumber.js';

export function useUploadPrice() {
  const dispatch = useDispatch();
  const { bundlr, isConnected } = useSelector(x => x.bundlrState);
  const { chain } = useNetwork();
  const file = useSelector(x => x.embalmState.file);
  const uploadPrice = useSelector(x => x.embalmState.uploadPrice);

  const formattedUploadPrice = useMemo(
    () =>
      isConnected
        ? `${parseFloat(ethers.utils.formatUnits(uploadPrice) || '0').toFixed(
            uploadPriceDecimals
          )} ${chain?.nativeCurrency?.name}`
        : '',
    [chain, isConnected, uploadPrice]
  );

  // Updates the upload price when the file changes
  useEffect(() => {
    (async () => {
      if (!file || !bundlr) return;

      const price: BN = await bundlr.getPrice(file.size);

      if (!price) return;

      // Use BigNumber from ethers.js
      const priceEthersBN = BigNumber.from(price.toString());

      // pads the price slightly to prevent the user from underfunding
      // (multiply by 1.1 when converted to number decimal, effectively)
      const paddedPrice = priceEthersBN.add(priceEthersBN.div(10));

      dispatch(setUploadPrice(paddedPrice));
    })();
  }, [bundlr, dispatch, file]);

  return { formattedUploadPrice, uploadPrice };
}
