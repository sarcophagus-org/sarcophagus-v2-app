import {
  Flex,
  NumberInput,
  NumberInputField,
  InputLeftElement,
  InputGroup,
  NumberInputProps,
  Input,
} from '@chakra-ui/react';
import { removeLeadingZeroes, removeNonIntChars } from 'lib/utils/helpers';
import {
  setDiggingFeesFilter,
  setUnwrapsFilter,
  setFailsFilter,
  SortFilterType,
  ArchaeologistListActions,
  setArchAddressSearch,
  setCurseFeeFilter,
} from 'store/archaeologistList/actions';
import { SarcoTokenIcon } from 'components/icons';
import { useDispatch } from 'store/index';

interface FilterProps extends NumberInputProps {
  filterName: SortFilterType;
  placeholder?: string;
}

interface NumberInputFilterComponentProps {
  filterWidth: string;
  filterTypeAction: (search: string) => ArchaeologistListActions;
  placeholder?: string;
  icon?: boolean;
}

function validateAndSetInput(
  valueAsString: string,
  valueAsNumber: number,
  action: (action: string) => ArchaeologistListActions
): ArchaeologistListActions {
  valueAsString = removeNonIntChars(valueAsString);
  valueAsString = removeLeadingZeroes(valueAsString);

  if (valueAsNumber < 0) {
    valueAsString = '0';
  }

  return action(valueAsString);
}

function NumberInputFilterComponent({
  filterWidth,
  placeholder,
  filterTypeAction,
  icon,
  ...rest
}: NumberInputFilterComponentProps) {
  const dispatch = useDispatch();

  return (
    <Flex align="center">
      <InputGroup>
        <NumberInput
          w={filterWidth}
          onChange={(valueAsString: string, valueAsNumber: number) =>
            dispatch(validateAndSetInput(valueAsString, valueAsNumber, filterTypeAction))
          }
          {...rest}
        >
          <NumberInputField
            pl={icon ? '12' : '3'}
            pr={1}
            placeholder={placeholder}
            borderColor="grayBlue.700"
          />
          {icon && (
            <InputLeftElement>
              <SarcoTokenIcon boxSize="16px" />
            </InputLeftElement>
          )}
        </NumberInput>
      </InputGroup>
    </Flex>
  );
}

export function FilterInput({ filterName, placeholder = '', ...rest }: FilterProps) {
  const dispatch = useDispatch();

  switch (filterName) {
    case SortFilterType.ADDRESS_SEARCH:
      function handleChangeAddressSearch(event: React.ChangeEvent<HTMLInputElement>) {
        dispatch(setArchAddressSearch(event.target.value));
      }
      return (
        <Input
          onChange={handleChangeAddressSearch}
          w="190px"
          placeholder="Search"
          borderColor="grayBlue.700"
          color="text.primary"
        />
      );

    case SortFilterType.DIGGING_FEES:
      return (
        <NumberInputFilterComponent
          filterWidth={'150px'}
          placeholder={placeholder}
          filterTypeAction={setDiggingFeesFilter}
          icon={true}
          {...rest}
        />
      );

    case SortFilterType.CURSE_FEE:
      return (
        <NumberInputFilterComponent
          filterWidth={'150px'}
          placeholder={placeholder}
          filterTypeAction={setCurseFeeFilter}
          icon={true}
          {...rest}
        />
      );

    case SortFilterType.UNWRAPS:
      return (
        <NumberInputFilterComponent
          filterWidth={'100px'}
          placeholder={placeholder}
          filterTypeAction={setUnwrapsFilter}
          {...rest}
        />
      );

    case SortFilterType.FAILS:
      return (
        <NumberInputFilterComponent
          filterWidth={'82px'}
          placeholder={placeholder}
          filterTypeAction={setFailsFilter}
          {...rest}
        />
      );

    default:
      return null;
  }
}
