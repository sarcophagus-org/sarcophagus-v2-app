import { BigNumber, ethers } from 'ethers';
import { uploadPriceDecimals } from 'lib/constants';
import { useEffect, useMemo } from 'react';
import { setUploadPrice } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { useNetwork } from 'wagmi';
// import { BigNumber as BN } from 'bignumber.js';
import { sarco } from 'sarcophagus-v2-sdk';
import { useSupportedNetwork } from 'lib/config/useSupportedNetwork';

export function useUploadPrice() {
  const dispatch = useDispatch();
  const { chain } = useNetwork();
  const file = useSelector(x => x.embalmState.file);
  const uploadPrice = useSelector(x => x.embalmState.uploadPrice);

  const { isBundlrConnected } = useSupportedNetwork();

  const formattedUploadPrice = useMemo(
    () =>
      isBundlrConnected
        ? `${parseFloat(ethers.utils.formatUnits(uploadPrice) || '0').toFixed(
            uploadPriceDecimals
          )} ${chain?.nativeCurrency?.name}`
        : '',
    [isBundlrConnected, uploadPrice, chain?.nativeCurrency?.name]
  );

  // Updates the upload price when the file changes
  useEffect(() => {
    (async () => {
      if (!file) return;

      const price = await sarco.bundlr.getPrice(file.size);

      if (!price) return;

      // Use BigNumber from ethers.js
      const priceEthersBN = BigNumber.from(price.toString());

      // pads the price slightly to prevent the user from underfunding
      // (multiply by 1.1 when converted to number decimal, effectively)
      const paddedPrice = priceEthersBN.add(priceEthersBN.div(10));

      dispatch(setUploadPrice(paddedPrice));
    })();
  }, [dispatch, file]);

  return { formattedUploadPrice, uploadPrice };
}
