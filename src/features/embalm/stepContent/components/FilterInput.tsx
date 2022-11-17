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
  DiggingFees = 'diggingFees',
  Unwraps = 'unwraps',
  Fails = 'fails',
}

interface FilterProps extends NumberInputProps {
  filterName: FilterName;
  placeholder?: string;
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
      function setDiggingFees(diggingFees: string) {
        return dispatch(setDiggingFeesFilter(diggingFees));
      }

      function handleChangeDiggingFees(valueAsString: string, valueAsNumber: number) {
        checkParams(valueAsString, valueAsNumber);
        setDiggingFees(valueAsString);
      }

      return (
        <Flex align="center">
          <InputGroup>
            <NumberInput
              w="150px"
              onChange={handleChangeDiggingFees}
              {...rest}
            >
              <NumberInputField
                pl={12}
                pr={1}
                placeholder={placeholder}
                borderColor="violet.700"
              />
              <InputLeftElement>
                <SarcoTokenIcon boxSize="16px" />
              </InputLeftElement>
            </NumberInput>
          </InputGroup>
        </Flex>
      );
    case FilterName.Unwraps:
      function setUnwraps(unwraps: string) {
        return dispatch(setUnwrapsFilter(unwraps));
      }

      function handleChangeUnwraps(valueAsString: string, valueAsNumber: number) {
        checkParams(valueAsString, valueAsNumber);

        setUnwraps(valueAsString);
      }

      return (
        <Flex align="center">
          <InputGroup>
            <NumberInput
              w="100px"
              onChange={handleChangeUnwraps}
              {...rest}
            >
              <NumberInputField
                pl={3}
                pr={1}
                placeholder={placeholder}
                borderColor="violet.700"
              />
            </NumberInput>
          </InputGroup>
        </Flex>
      );
    case FilterName.Fails:
      function setFails(fails: string) {
        return dispatch(setFailsFilter(fails));
      }

      function handleChangeFails(valueAsString: string, valueAsNumber: number) {
        checkParams(valueAsString, valueAsNumber);
        setFails(valueAsString);
      }

      return (
        <Flex align="center">
          <InputGroup>
            <NumberInput
              w="82px"
              onChange={handleChangeFails}
              {...rest}
            >
              <NumberInputField
                pl={3}
                pr={1}
                placeholder={placeholder}
                borderColor="violet.700"
              />
            </NumberInput>
          </InputGroup>
        </Flex>
      );

    default:
      return filterName;
  }
}
