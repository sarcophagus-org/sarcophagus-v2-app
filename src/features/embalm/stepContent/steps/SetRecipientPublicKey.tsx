import { Box, Link, Text, Textarea, VStack } from '@chakra-ui/react';
import { RecipientSetByOption, setRecipientState } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { RecoverPublicKey } from '../components/RecoverPublicKey';
import { GenerateRecipientPDF } from '../components/GenerateRecipientPDF';

import { GroupBase, OptionBase, Select } from 'chakra-react-select';
import { validateRecipient } from 'features/embalm/stepNavigator/hooks/useSetStatuses';
import { SarcoAlert } from 'components/SarcoAlert';

interface IRecipientSetByOption extends OptionBase {
  label: string;
  value: RecipientSetByOption;
}

const PUBLIC_DISCLOSURE_PUBLIC_KEY =
  '0x04d1ed64129053907e87bf904e693a846432f8b9743c66cb703216f633a22b8d3d9860302182399eb2b55b9cccd6462b1ef90b4be4f6a9b07519623d274caa0000';

export function SetRecipientPublicKey() {
  const dispatch = useDispatch();
  const { recipientState } = useSelector(x => x.embalmState);

  function handleOnChange(newValue: IRecipientSetByOption | null) {
    // If public disclosure is selected, use hardcoded public key
    if (newValue?.value === RecipientSetByOption.PUBLIC_DISCLOSURE) {
      dispatch(
        setRecipientState({
          publicKey: PUBLIC_DISCLOSURE_PUBLIC_KEY.replaceAll(/\s+/g, ''),
          address: '',
          privateKey: undefined,
          setByOption: newValue ? newValue.value : null,
        })
      );
    } else {
      dispatch(
        setRecipientState({
          publicKey: '',
          address: '',
          privateKey: undefined,
          setByOption: newValue ? newValue.value : null,
        })
      );
    }
  }

  const selectOptionsMap: IRecipientSetByOption[] = [
    { value: RecipientSetByOption.ADDRESS, label: 'Wallet address' },
    { value: RecipientSetByOption.PUBLIC_KEY, label: 'I have a public key' },
    { value: RecipientSetByOption.PUBLIC_DISCLOSURE, label: 'Public Disclosure (beta)' },
    { value: RecipientSetByOption.GENERATE, label: 'Create new' },
  ];

  return (
    <VStack
      align="left"
      w="100%"
    >
      <Text
        variant="secondary"
        mb={6}
      >
        Sarcophagus can lookup a public key by recipient wallet address if the address has made a
        transaction. Otherwise you will need the public key, or choose ‘Create New’ to generate a
        new key, or select Public Disclosure.
      </Text>
      <VStack
        align="left"
        spacing={9}
      >
        <VStack
          align="left"
          spacing="5"
        >
          <Box cursor="pointer">
            <Select<IRecipientSetByOption, false, GroupBase<IRecipientSetByOption>>
              value={
                recipientState.setByOption
                  ? selectOptionsMap[recipientState.setByOption - 1]
                  : undefined
              }
              onChange={handleOnChange}
              placeholder="Select recipient method"
              options={selectOptionsMap}
              isSearchable={false}
              focusBorderColor="brand.950"
              selectedOptionColor="brand.0"
              useBasicStyles
              chakraStyles={{
                menuList: provided => ({
                  ...provided,
                  bg: 'brand.0',
                  fontSize: 'sm',
                  borderColor: 'grayBlue.700',
                }),

                option: (provided, state) => ({
                  ...provided,
                  background: state.isFocused ? 'brand.100' : provided.background,
                  fontSize: 'sm',
                }),

                control: provided => ({
                  ...provided,
                  bg: 'brand.0',
                  border: '1px',
                  borderRadius: 0,
                  borderColor: 'brand.950',
                  fontSize: 'sm',
                  _disabled: {
                    borderColor: 'brand.300',
                    color: 'brand.300',
                  },
                }),
              }}
            />
          </Box>
          {recipientState.setByOption === RecipientSetByOption.PUBLIC_DISCLOSURE && (
            <VStack align="left">
              <Text>
                Disclose to the public via{' '}
                <Link
                  href="https://twitter.com/Thoth_Discloser"
                  target="_blank"
                  textDecor="underline"
                >
                  @Thoth_Discloser
                </Link>{' '}
                on Twitter. This will generate a public key and disclose it to the public.
              </Text>
            </VStack>
          )}
          {recipientState.setByOption === RecipientSetByOption.ADDRESS && <RecoverPublicKey />}
          {recipientState.setByOption === RecipientSetByOption.PUBLIC_KEY && (
            <VStack align="left">
              <Textarea
                onChange={e =>
                  dispatch(
                    setRecipientState({
                      publicKey: e.target.value.replaceAll(/\s+/g, ''),
                      address: '',
                      setByOption: RecipientSetByOption.PUBLIC_KEY,
                    })
                  )
                }
                disabled={false}
                placeholder="0x0000..."
                value={recipientState.publicKey}
                height="110px"
                resize="none"
              />
              <Text>
                This is the public key of your recipient wallet, if you don’t have this, try using
                the wallet address option or create a new one.
              </Text>
              {recipientState.publicKey !== '' && !validateRecipient(recipientState) && (
                <Box pt={6}>
                  <SarcoAlert status="warning">Invalid public key</SarcoAlert>
                </Box>
              )}
            </VStack>
          )}
          {recipientState.setByOption === RecipientSetByOption.GENERATE && <GenerateRecipientPDF />}
        </VStack>
      </VStack>
    </VStack>
  );
}
