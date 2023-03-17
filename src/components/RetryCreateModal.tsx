import { Flex, Text } from '@chakra-ui/react';
import { useSarcoModal } from './useSarcoModal';
import { toggleRetryingCreate } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { useLoadArchaeologists } from 'features/embalm/stepContent/hooks/useLoadArchaeologists';
import { ethers } from 'ethers';
import { useBundlrBalance } from 'features/embalm/stepContent/hooks/useBundlrBalance';
import { SummaryErrorIcon } from 'features/embalm/stepContent/components/SummaryErrorIcon';
import { useUploadPrice } from 'features/embalm/stepNavigator/hooks/useUploadPrice';
import { useState } from 'react';

export function RetryCreateModal({ cancelCreation }: { cancelCreation: Function }) {
  const dispatch = useDispatch();
  const {
    selectedArchaeologists,
    resurrection: resurrectionTimeMs,
    retryingCreate,
  } = useSelector(s => s.embalmState);

  const { uploadPrice, formattedUploadPrice } = useUploadPrice();

  const { refreshProfiles } = useLoadArchaeologists();

  const { balance: bundlrBalance } = useBundlrBalance();

  const { SarcoModal, openModal, closeModal, isOpen } = useSarcoModal();

  const hasEnoughReUploadBalance = bundlrBalance.gte(uploadPrice);
  const [archsHaveEnoughReUploadFreeBond, setArchsHaveEnoughReUploadFreeBond] = useState(true);

  if (retryingCreate && !isOpen) {
    refreshProfiles(selectedArchaeologists.map(a => a.profile.archAddress)).then(
      async updatedArchs => {
        for await (const arch of updatedArchs) {
          const resurrectionIntervalMs = resurrectionTimeMs - Date.now();

          const estimatedCurse = !resurrectionTimeMs
            ? ethers.constants.Zero
            : arch.profile.minimumDiggingFeePerSecond.mul(
                Math.trunc(resurrectionIntervalMs / 1000)
              );

          // TODO: also validate with curse fee once implemented
          if (estimatedCurse.gt(arch.profile.freeBond)) {
            arch.hiddenReason =
              'This archaeologist does not have enough in free bond to be responsible for your Sarcophagus for the length of time you have set.';
            setArchsHaveEnoughReUploadFreeBond(false);
          }
        }

        openModal();
      }
    );
  } else if (!retryingCreate && isOpen) {
    closeModal();
  }

  const validationFailed = !archsHaveEnoughReUploadFreeBond || !hasEnoughReUploadBalance;

  return (
    <SarcoModal
      isDismissible={false}
      secondaryButton={{
        dismissesModal: true,
        label: validationFailed ? 'Cancel Sarcophagus' : 'Continue',
        onClick: () => {
          dispatch(toggleRetryingCreate());
          if (validationFailed) cancelCreation();
        },
      }}
      title={<Text>Retry Create Sarcophagus</Text>}
    >
      <Text
        variant="secondary"
        mb="25"
        textAlign="center"
        fontWeight="bold"
      >
        Due to a high traffic volume, one or more of your selected archaeologists provided an
        encryption key that has now been used up.
      </Text>
      {validationFailed ? (
        <Flex
          flexDirection="column"
          mb="10px"
        >
          <Flex
            mt={3}
            alignItems="center"
            mb="30px"
          >
            <SummaryErrorIcon />
            <Text
              variant="secondary"
              fontSize="s"
              ml={2}
              textAlign={'center'}
            >
              You will need to recreate your sarcophagus:
            </Text>
          </Flex>
          {!archsHaveEnoughReUploadFreeBond ? (
            <Text
              variant="secondary"
              fontSize="xs"
              mb="10px"
            >
              - One or more of your selected archaeologists no longer have enough free bond to lock
              up.
            </Text>
          ) : (
            <></>
          )}
          {!hasEnoughReUploadBalance ? (
            <Text
              variant="secondary"
              fontSize="xs"
            >
              - You do not have enough Bundlr balance to re-upload
            </Text>
          ) : (
            <></>
          )}
        </Flex>
      ) : (
        <Flex flexDirection="column">
          <Text
            variant="secondary"
            fontSize="xs"
            mb="10px"
            textAlign="center"
          >
            Your file will need to be re-uploaded, and new encryption keys will be requested of the
            archaeologists.
          </Text>
          <Text
            variant="secondary"
            fontSize="xs"
            textAlign="center"
          >
            Upload price: {formattedUploadPrice}
          </Text>
        </Flex>
      )}
    </SarcoModal>
  );
}
