import { SarcoAlert } from 'components/SarcoAlert';
import { useSelector } from 'store/index';
import { useGetBalance } from '../hooks/useGetBalance';
import { useUploadPrice } from 'features/embalm/stepNavigator/hooks/useUploadPrice';

export function BundlrAlertMessage() {
  const file = useSelector(x => x.embalmState.file);
  const { balance } = useGetBalance();
  const { uploadPrice } = useUploadPrice();

  if (!file) {
    return <SarcoAlert status="warning">Upload a payload to get the upload price.</SarcoAlert>;
  }

  if (balance.lt(uploadPrice)) {
    return <SarcoAlert status="warning">You need to add funds to Bundlr.</SarcoAlert>;
  }

  return (
    <SarcoAlert status="success">
      You have enough funds in Bundlr. You can top up your balance or continue to the next step.
    </SarcoAlert>
  );
}
