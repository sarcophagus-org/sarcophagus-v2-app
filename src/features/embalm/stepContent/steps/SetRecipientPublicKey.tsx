import { Text, VStack, Textarea, Box } from '@chakra-ui/react';
import { setRecipientState, RecipientSetByOption } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { RecoverPublicKey } from '../components/RecoverPublicKey';
import { GenerateRecipientPDF } from '../components/GenerateRecipientPDF';

import { Select, OptionBase, GroupBase } from 'chakra-react-select';
import { validateRecipient } from 'features/embalm/stepNavigator/hooks/useSetStatuses';
import { Alert } from 'components/Alert';
interface IRecipientSetByOption extends OptionBase {
  label: string;
  value: RecipientSetByOption;
}

export function SetRecipientPublicKey() {
  const dispatch = useDispatch();
  const { recipientState } = useSelector(x => x.embalmState);

  function handleOnChange(newValue: IRecipientSetByOption | null) {
    dispatch(
      setRecipientState({
        publicKey: '',
        address: '',
        privateKey: undefined,
        setByOption: newValue ? newValue.value : null,
      })
    );
  }

  const selectOptionsMap: IRecipientSetByOption[] = [
    { value: RecipientSetByOption.ADDRESS, label: 'Wallet address' },
    { value: RecipientSetByOption.PUBLIC_KEY, label: 'I have a public key' },
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
        Sarco can lookup a public key by recipient wallet address if the address has made a
        transaction. Otherwise you will need the public key or choose ‘Create New’.
      </Text>
      <VStack
        align="left"
        spacing={9}
      >
        <VStack
          align="left"
          spacing="5"
        >
          <Select<IRecipientSetByOption, false, GroupBase<IRecipientSetByOption>>
            value={
              recipientState.setByOption
                ? selectOptionsMap[recipientState.setByOption - 1]
                : undefined
            }
            onChange={handleOnChange}
            placeholder="Select recipient method"
            options={selectOptionsMap}
            focusBorderColor="brand.950"
            selectedOptionColor="brand"
            useBasicStyles
            chakraStyles={{
              menuList: provided => ({
                ...provided,
                bg: 'brand.0',
                fontSize: 'sm',
                borderColor: 'violet.700',
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

          {recipientState.setByOption === RecipientSetByOption.ADDRESS && <RecoverPublicKey />}
          {recipientState.setByOption === RecipientSetByOption.PUBLIC_KEY && (
            <VStack align="left">
              <Textarea
                onChange={e =>
                  dispatch(
                    setRecipientState({
                      publicKey: e.target.value,
                      address: '',
                      setByOption: RecipientSetByOption.PUBLIC_KEY,
                    })
                  )
                }
                disabled={false}
                placeholder="public key"
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
                  <Alert status="warning">Invalid public key</Alert>
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
