import { sleep } from '@bundlr-network/client/build/common/utils';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Button, Collapse, Flex, IconButton, Text, useDisclosure } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import {
  goToStep,
  RecipientSetByOption,
  selectArchaeologist,
  setCustomResurrectionDate,
  setFile,
  setName,
  setRecipientState,
  setRequiredArchaeologists,
  setResurrection,
  setResurrectionRadioValue,
} from 'store/embalm/actions';
import { Step } from 'store/embalm/reducer';
import { useDispatch, useSelector } from 'store/index';

// The delay between actions in ms. Set to 0 for the form to fill instantaneously.
const delay = 100;
const sarcohagusName = 'Sarcophagus Name';
const resurrectionDate = new Date();
resurrectionDate.setMinutes(resurrectionDate.getMinutes() + 60); // 1 hour
const file = new File(['Hello'], 'hello.txt', { type: 'text/plain' });
const recipientPublicKey =
  '0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5';
const recipientAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

/**
 * Component that provides a button that automatically fills out the sarcophagus form.
 * @returns
 */
export function MagicFormFiller() {
  const dispatch = useDispatch();
  const { archaeologists } = useSelector(x => x.embalmState);
  const onlineArchaeologists = archaeologists.filter(x => x.isOnline);
  const [isWorking, setIsWorking] = useState(false);
  const { isOpen, onToggle } = useDisclosure();

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
    await sleep(delay);
    dispatch(goToStep(Step.SelectArchaeologists));
    await sleep(delay);
    dispatch(selectArchaeologist(onlineArchaeologists[0]));

    // Set required archaeologists
    await sleep(delay);
    dispatch(goToStep(Step.RequiredArchaeologists));
    await sleep(delay);
    dispatch(setRequiredArchaeologists(1));

    // Create sarcophagus
    await sleep(delay);
    dispatch(goToStep(Step.CreateSarcophagus));

    setIsWorking(false);
  }, [dispatch, onlineArchaeologists]);

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
      <Flex
        align="center"
        w="100%"
        justify="space-between"
      >
        <Text
          variant="secondary"
          fontSize="xs"
        >
          FOR DEV USE ONLY
        </Text>
        <IconButton
          float="right"
          aria-label="Close dev panel"
          variant="unstyled"
          icon={isOpen ? <ChevronDownIcon fontSize="xs" /> : <ChevronUpIcon fontSize="xs" />}
          onClick={onToggle}
        />
      </Flex>
      <Collapse in={isOpen}>
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
      </Collapse>
    </Flex>
  );
}
