import { Text } from '@chakra-ui/react';
import { useSarcoModal } from './useSarcoModal';
import { toggleRetryingCreate } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { useState } from 'react';
import { useLoadArchaeologists } from 'features/embalm/stepContent/hooks/useLoadArchaeologists';
import { ethers } from 'ethers';
import { useBundlrBalance } from 'features/embalm/stepContent/hooks/useBundlrBalance';

export function RetryCreateModal() {
  const dispatch = useDispatch();
  const {
    retryingCreate,
    selectedArchaeologists,
    resurrection: resurrectionTimeMs,
    uploadPrice,
  } = useSelector(s => s.embalmState);

  const { refreshProfiles } = useLoadArchaeologists();

  const [refreshingProfiles, setRefreshingProfiles] = useState(false);
  const { balance: bundlrBalance } = useBundlrBalance();

  const { SarcoModal, openModal, closeModal, isOpen } = useSarcoModal();

  let hasEnoughReUploadBalance = true;
  let archsHaveEnoughReUploadFreeBond = true;

  if (retryingCreate && !isOpen) {
    setRefreshingProfiles(true);
    openModal();

    refreshProfiles(selectedArchaeologists.map(a => a.profile.archAddress)).then(
      async updatedArchs => {
        for await (const arch of updatedArchs) {
          const resurrectionIntervalMs = resurrectionTimeMs - Date.now();

          const estimatedCurse = !resurrectionTimeMs
            ? ethers.constants.Zero
            : arch.profile.minimumDiggingFeePerSecond.mul(
                Math.trunc(resurrectionIntervalMs / 1000)
              );

          if (estimatedCurse.gt(arch.profile.freeBond)) {
            arch.hiddenReason =
              'This archaeologist does not have enough in free bond to be responsible for your Sarcophagus for the length of time you have set.';
            archsHaveEnoughReUploadFreeBond = false;
          }
        }

        hasEnoughReUploadBalance = bundlrBalance.gte(uploadPrice);
        setRefreshingProfiles(false);
      }
    );
  } else if (!retryingCreate && isOpen) {
    closeModal();
    setRefreshingProfiles(false);
  }

  return (
    <SarcoModal
      isDismissible={false}
      secondaryButton={{
        dismissesModal: true,
        label: 'cancel',
        onClick: () => dispatch(toggleRetryingCreate()),
      }}
      title={<Text>Retry Create Sarcophagus</Text>}
    >
      {refreshingProfiles ? <Text>Loading...</Text> : <></>}
      <Text>
        Due to high volume of traffic, one or more of your selected archaeologists provided an
        encryption key that has now been used up.
      </Text>
      {archsHaveEnoughReUploadFreeBond && hasEnoughReUploadBalance ? (
        <></>
      ) : (
        <Text>You will need to request new keys</Text>
      )}
    </SarcoModal>
  );
}
