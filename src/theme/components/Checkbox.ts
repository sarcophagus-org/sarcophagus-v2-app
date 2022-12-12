import { checkboxAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  checkboxAnatomy.keys
);

const blue = definePartsStyle({
  control: {
    borderRadius: 0,
    _checked: {
      bg: 'blue',
      borderColor: 'blue',
      _hover: {
        bg: 'blue',
        borderColor: 'blue',
      },
    },
  },
});

const brand = definePartsStyle({
  control: {
    borderRadius: 0,
    _checked: {
      bg: 'brand.500',
      borderColor: 'brand.500',
      _hover: {
        bg: 'brand.500',
        borderColor: 'brand.500',
      },
    },
  },
});

export const Checkbox = defineMultiStyleConfig({
  baseStyle: blue,
  sizes: {},
  variants: {
    blue,
    brand,
  },
  defaultProps: {},
});
