import { Heading, Text, VStack, HStack, RadioGroup, Radio, Textarea } from '@chakra-ui/react';
import { setPublicKey, setRecipientAddress } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { useState } from 'react';
import { RecoverPublicKey } from 'components/recoverPublicKey';

enum SetByRadioValue {
  ADDRESS,
  PUBLIC_KEY,
}

export function SetRecipientPublicKey() {
  const dispatch = useDispatch();
  const { publicKey, recipientAddress } = useSelector(x => x.embalmState);
  const [value, setValue] = useState<SetByRadioValue | undefined>(() => {
    if (recipientAddress !== '') return SetByRadioValue.ADDRESS;
    else if (publicKey !== '') return SetByRadioValue.PUBLIC_KEY;
    else return undefined;
  });

  function onRadioGroupChange(nextValue: string) {
    setValue(parseInt(nextValue));
    dispatch(setPublicKey(''));
    dispatch(setRecipientAddress(''));
  }

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
            value={value}
          >
            <Radio value={SetByRadioValue.ADDRESS}>Address</Radio>
            <Radio
              ml={8}
              value={SetByRadioValue.PUBLIC_KEY}
            >
              Public Key
            </Radio>
          </RadioGroup>
          {value === SetByRadioValue.ADDRESS && <RecoverPublicKey />}
          {value === SetByRadioValue.PUBLIC_KEY && (
            <HStack>
              <Textarea
                onChange={e => dispatch(setPublicKey(e.target.value))}
                disabled={false}
                placeholder="public key"
                value={publicKey || ''}
                height="110px"
                resize="none"
              />
            </HStack>
          )}
        </VStack>
      </VStack>
    </VStack>
  );
}
