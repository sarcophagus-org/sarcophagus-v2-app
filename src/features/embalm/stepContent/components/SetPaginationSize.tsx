import { Box } from '@chakra-ui/react';
import { Select, OptionBase, GroupBase } from 'chakra-react-select';

export interface IPageSizeSetByOption extends OptionBase {
  value: number;
  label: string;
}

export function SetPaginationSize({ handlePageSizeChange, paginationSize }: any) {
  const pageSizeOptionsMap: IPageSizeSetByOption[] = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 20, label: '20' },
  ];

  return (
    <Box cursor="pointer">
      <Select<IPageSizeSetByOption, false, GroupBase<IPageSizeSetByOption>>
        value={pageSizeOptionsMap.filter(function (option) {
          return option.value === paginationSize;
        })}
        onChange={handlePageSizeChange}
        placeholder=""
        options={pageSizeOptionsMap}
        isSearchable={false}
        focusBorderColor="transparent"
        selectedOptionColor="brand.950"
        useBasicStyles
        chakraStyles={{
          menu: provided => ({
            ...provided,
            my: '-0.3rem',
          }),

          menuList: provided => ({
            ...provided,
            bg: 'brand.0',
            fontSize: '14px',
            borderColor: 'violet.700',
          }),

          option: (provided, state) => ({
            ...provided,
            background: state.isFocused ? 'brand.100' : provided.background,
            fontSize: '14px',
            color: 'text.secondary',
            my: '-0.2rem',
            _active: {
              bg: 'brand.200',
            },
          }),

          control: provided => ({
            ...provided,
            my: '-1rem',
            marginLeft: '-0.6rem',
            w: '75px',
            bg: 'brand.0',
            color: 'text.secondary',
            borderColor: 'transparent',
            _hover: {
              borderColor: 'transparent',
            },
            fontSize: '14px',
          }),
        }}
      />
    </Box>
  );
}
