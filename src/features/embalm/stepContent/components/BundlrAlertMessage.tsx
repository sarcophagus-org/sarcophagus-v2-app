import { SarcoAlert } from 'components/SarcoAlert';
import { useSelector } from 'store/index';
import { useGetBalance } from '../hooks/useGetBalance';
import { useUploadPrice } from 'features/embalm/stepNavigator/hooks/useUploadPrice';
import { useBundlr } from '../hooks/useBundlr';
import { ethers } from 'ethers';

export function BundlrAlertMessage() {
  const file = useSelector(x => x.embalmState.file);
  const { balance } = useGetBalance();
  const { uploadPrice } = useUploadPrice();
  const { isFunding } = useBundlr();
  const { balanceOffset } = useSelector(x => x.bundlrState);

  if (!file) {
    return <SarcoAlert status="warning">Upload a payload to get the upload price.</SarcoAlert>;
  }

  if (balance.lt(uploadPrice)) {
    return isFunding || !balanceOffset.eq(ethers.constants.Zero) ? (
      <SarcoAlert status="info">
        Bundlr is currently being funded. You can continue to modify your sarcophagus during this
        process as well as add more funds if necessary. You will be notified when funding completes.
      </SarcoAlert>
    ) : (
      <SarcoAlert status="warning">You need to add funds to Bundlr.</SarcoAlert>
    );
  }

  return (
    <SarcoAlert status="success">
      You have enough funds in Bundlr. You can top up your balance or continue to the next step.
    </SarcoAlert>
  );
}
