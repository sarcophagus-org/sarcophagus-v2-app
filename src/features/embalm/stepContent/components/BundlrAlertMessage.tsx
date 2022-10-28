import { Alert } from 'components/Alert';
import { useSelector } from 'store/index';
import { useGetBalance } from '../hooks/useGetBalance';
import { useUploadPrice } from 'features/embalm/stepNavigator/hooks/useUploadPrice';

export function BundlrAlertMessage() {
  const file = useSelector(x => x.embalmState.file);
  const { balance } = useGetBalance();
  const { uploadPrice } = useUploadPrice();

  if (!file) {
    return <Alert status="warning">Upload a payload to get the upload price.</Alert>;
  }

  if (parseFloat(balance) < parseFloat(uploadPrice)) {
    return <Alert status="warning">You need to add funds to Bundlr.</Alert>;
  }

  return (
    <Alert status="success">
      You have enough funds in Bundlr. You can top up your balance or continue to the next step.
    </Alert>
  );
}
