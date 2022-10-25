import { sleep } from '@bundlr-network/client/build/common/utils';
import { Button, Flex, Text } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import {
  goToStep,
  RecipientSetByOption,
  selectArchaeologist,
  setCustomResurrectionDate,
  setFile,
  setName,
  setRecipientState,
  setResurrection,
  setResurrectionRadioValue,
} from 'store/embalm/actions';
import { Step } from 'store/embalm/reducer';
import { useDispatch, useSelector } from 'store/index';

// The delay between actions in ms. Set to 0 for the form to fill instantaneously.
const delay = 500;
const sarcohagusName = 'Sarcophagus Name';
const resurrectionDate = new Date();
resurrectionDate.setMinutes(resurrectionDate.getMinutes() + 30);
const file = new File(['Hello'], 'hello.txt', { type: 'text/plain' });
const recipientPublicKey =
  '0x0412cac174c12fb6eb4e550a9c4a00016a59c8d70ab3ad879507aa3bae5a3c2bef8668ed69619ad13277dabc1f39dd1476e037b034754aa7beaafd4537399b02bf';
const recipientAddress = '0x32dA65c2692e6F70Cd61bD56097b8f4eDe99bB0E';

/**
 * Component that provides a button that automatically fills out the sarcophagus form.
 * Selects an archaeologist even if it is not online yet.
 * @returns
 */
export function MagicFormFiller() {
  const dispatch = useDispatch();
  const { archaeologists } = useSelector(x => x.embalmState);
  const onlineArchaeologists = archaeologists.filter(x => x.isOnline);
  const [isWorking, setIsWorking] = useState(false);

  const handleClickMagicButton = useCallback(async () => {
    setIsWorking(true);

    // Name Sarcophagus
    await sleep(delay);
    dispatch(goToStep(Step.NameSarcophagus));
    dispatch(setName(sarcohagusName));

    // Set resurrection
    await sleep(delay);
    dispatch(goToStep(Step.NameSarcophagus));
    dispatch(setResurrectionRadioValue('Other'));
    dispatch(setCustomResurrectionDate(resurrectionDate));
    dispatch(setResurrection(resurrectionDate.getTime()));

    // Upload payload
    await sleep(delay);
    dispatch(goToStep(Step.UploadPayload));
    await sleep(delay);
    dispatch(setFile(file));

    // Fund Bundlr
    await sleep(delay);
    dispatch(goToStep(Step.FundBundlr));

    // Set recipient
    await sleep(delay);
    dispatch(goToStep(Step.SetRecipient));
    await sleep(delay);
    dispatch(
      setRecipientState({
        publicKey: recipientPublicKey,
        address: recipientAddress,
        setByOption: RecipientSetByOption.PUBLIC_KEY,
      })
    );

    // Select archaeologists
    // This will select the archaeologist before it has been discovered
    await sleep(delay);
    dispatch(goToStep(Step.SelectArchaeologists));
    await sleep(delay);
    dispatch(selectArchaeologist(archaeologists[0]));

    // Create sarcophagus
    await sleep(delay);
    dispatch(goToStep(Step.CreateSarcophagus));

    setIsWorking(false);
  }, [archaeologists, dispatch]);

  return (
    <Flex
      position="absolute"
      top={100}
      right={50}
      direction="column"
      alignItems="center"
      w={300}
      border="1px solid"
      borderColor="brand.200"
      py={3}
      px={6}
    >
      <Text
        variant="secondary"
        fontSize="xs"
      >
        FOR DEV USE ONLY
      </Text>
      <Text
        variant="secondary"
        fontSize="xs"
      >
        Fill out the form automatically
      </Text>
      <Button
        size="xs"
        w="100%"
        mt={3}
        isLoading={isWorking || onlineArchaeologists.length === 0}
        bg="linear-gradient(172deg, rgba(150,5,245,1) 0%, rgba(173,63,158,1) 67%, rgba(255,0,125,1) 93%)"
        _hover={{
          bg: 'linear-gradient(172deg, rgba(150,5,245,1) 0%, rgba(173,63,158,1) 67%, rgba(255,0,125,1) 93%)',
          opacity: 0.8,
        }}
        color="brand.950"
        onClick={handleClickMagicButton}
      >
        Do Magic
      </Button>
      {onlineArchaeologists.length === 0 && (
        <Text
          mt={3}
          variant="secondary"
          textAlign="center"
          fontSize="xs"
        >
          Waiting for archaeologists to load...
        </Text>
      )}
    </Flex>
  );
}