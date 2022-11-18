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
} from 'store/archaeologistList/actions';
import { SarcoTokenIcon } from 'components/icons';
import { useDispatch } from 'store/index';

export enum FilterName {
  DiggingFees = 'digging_fees',
  Unwraps = 'unwraps',
  Fails = 'fails',
}

interface FilterProps extends NumberInputProps {
  filterName: FilterName;
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
    case FilterName.DiggingFees:
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

    case FilterName.Unwraps:
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

    case FilterName.Fails:
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

    default:
      return filterName;
  }
}
