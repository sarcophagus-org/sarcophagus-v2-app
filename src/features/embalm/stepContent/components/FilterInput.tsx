import {
  Flex,
  NumberInput,
  NumberInputField,
  InputLeftElement,
  InputGroup,
  NumberInputProps,
} from '@chakra-ui/react';
import { removeLeadingZeroes, removeNonIntChars } from 'lib/utils/helpers';
import {
  setDiggingFeesFilter,
  setUnwrapsFilter,
  setFailsFilter,
  setArchAddressSearch,
  SortFilterType,
} from 'store/archaeologistList/actions';
import { SarcoTokenIcon } from 'components/icons';
import { useDispatch } from 'store/index';

interface FilterProps extends NumberInputProps {
  filterName: SortFilterType;
  placeholder?: string;
}

interface FilterComponentProps {
  filterWidth: string;
  onChange: (valueAsString: string, valueAsNumber: number) => void;
  placeholder?: string;
  icon: boolean;
}

function FilterComponent({
  filterWidth,
  placeholder,
  onChange,
  icon,
  ...rest
}: FilterComponentProps) {
  return (
    <Flex align="center">
      <InputGroup>
        <NumberInput
          w={filterWidth}
          onChange={onChange}
          {...rest}
        >
          <NumberInputField
            pl={icon ? '12' : '3'}
            pr={1}
            placeholder={placeholder}
            borderColor="violet.700"
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
  function checkParams(valueAsString: string, valueAsNumber: number) {
    valueAsString = removeNonIntChars(valueAsString);
    valueAsString = removeLeadingZeroes(valueAsString);

    if (valueAsNumber < 0) {
      valueAsString = '0';
      valueAsNumber = 0;
    }
  }

  switch (filterName) {
    case SortFilterType.ADDRESS_SEARCH:
      function handleChangeAddressSearch(valueAsString: string, valueAsNumber: number) {
        checkParams(valueAsString, valueAsNumber);
        dispatch(setArchAddressSearch(valueAsString));
      }

      return (
        <FilterComponent
          filterWidth={'190px'}
          placeholder={placeholder}
          onChange={handleChangeAddressSearch}
          icon={false}
          {...rest}
        />
      );

    case SortFilterType.DIGGING_FEES:
      function handleChangeDiggingFees(valueAsString: string, valueAsNumber: number) {
        checkParams(valueAsString, valueAsNumber);
        dispatch(setDiggingFeesFilter(valueAsString));
      }

      return (
        <FilterComponent
          filterWidth={'150px'}
          placeholder={placeholder}
          onChange={handleChangeDiggingFees}
          icon={true}
          {...rest}
        />
      );

    case SortFilterType.UNWRAPS:
      function handleChangeUnwraps(valueAsString: string, valueAsNumber: number) {
        checkParams(valueAsString, valueAsNumber);
        dispatch(setUnwrapsFilter(valueAsString));
      }

      return (
        <FilterComponent
          filterWidth={'100px'}
          placeholder={placeholder}
          onChange={handleChangeUnwraps}
          icon={false}
          {...rest}
        />
      );

    case SortFilterType.FAILS:
      function handleChangeFails(valueAsString: string, valueAsNumber: number) {
        checkParams(valueAsString, valueAsNumber);
        dispatch(setFailsFilter(valueAsString));
      }

      return (
        <FilterComponent
          filterWidth={'82px'}
          placeholder={placeholder}
          onChange={handleChangeFails}
          icon={false}
          {...rest}
        />
      );

    case SortFilterType.NONE:
      return null;

    default:
      return filterName;
  }
}
