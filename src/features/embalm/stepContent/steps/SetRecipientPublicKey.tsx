import {
  Heading,
  Text,
  VStack,
  HStack,
  RadioGroup,
  Radio,
  Textarea,
  Button,
} from '@chakra-ui/react';
import { setRecipient, RecipientSetByOption, setRecipientSetByOption } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { RecoverPublicKey } from 'components/recoverPublicKey';
import { useCreateRecipientPDF } from '../hooks/useCreateRecipientPDF';

export function SetRecipientPublicKey() {
  const dispatch = useDispatch();
  const { recipient, recipientSetByOption } = useSelector(x => x.embalmState);

  function onRadioGroupChange(nextValue: string) {
    dispatch(setRecipientSetByOption(parseInt(nextValue)));
    dispatch(
      setRecipient({
        publicKey: '',
        address: '',
        privateKey: undefined,
      })
    );
  }
  const { generateAndDownloadRecipientPDF, isLoading } = useCreateRecipientPDF();

  return (
    <VStack
      spacing={9}
      align="left"
      w="100%"
    >
      <Heading>Set recipient public key</Heading>
      <Text variant="secondary">
        Choose how to set public key. Lookup by address or enter a public key.
      </Text>
      <VStack
        align="left"
        spacing={6}
      >
        <VStack
          align="left"
          spacing="5"
        >
          <RadioGroup
            onChange={onRadioGroupChange}
            value={recipientSetByOption}
          >
            <Radio value={RecipientSetByOption.ADDRESS}>Address</Radio>
            <Radio
              ml={8}
              value={RecipientSetByOption.PUBLIC_KEY}
            >
              Public Key
            </Radio>
            <Radio
              ml={8}
              value={RecipientSetByOption.GENERATE}
            >
              Create New Keys
            </Radio>
          </RadioGroup>
          {recipientSetByOption === RecipientSetByOption.ADDRESS && <RecoverPublicKey />}
          {recipientSetByOption === RecipientSetByOption.PUBLIC_KEY && (
            <HStack>
              <Textarea
                onChange={e => dispatch(setRecipient({ publicKey: e.target.value, address: '' }))}
                disabled={false}
                placeholder="public key"
                value={recipient.publicKey}
                height="110px"
                resize="none"
              />
            </HStack>
          )}
          {recipientSetByOption === RecipientSetByOption.GENERATE && (
            <VStack
              align="left"
              spacing={4}
            >
              <Text>Generate a new public / private key set. And download to a printable PDF.</Text>

              <Button
                width="fit-content"
                onClick={generateAndDownloadRecipientPDF}
                isLoading={isLoading}
              >
                Generate and Download
              </Button>
            </VStack>
          )}
        </VStack>
      </VStack>
    </VStack>
  );
}
