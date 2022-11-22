import { ComponentStyleConfig } from '@chakra-ui/react';

export const Text: ComponentStyleConfig = {
  baseStyle: {
    fontWeight: 400,
    fontSize: 14,
  },
  variants: {
    primary: {
      color: 'brand.950',
    },
    secondary: {
      color: 'brand.600',
    },
    bold: {
      fontWeight: 900,
      color: 'brand.950',
    },
  },
  defaultProps: {
    variant: 'primary',
  },
};
