import { ComponentStyleConfig } from '@chakra-ui/react';

export const Input: ComponentStyleConfig = {
  variants: {
    main: {
      field: {
        bg: 'brand.0',
        border: '1px',
        borderRadius: 0,
        borderColor: 'brand.950',
        marginTop: 1,
      },
    },
  },
  defaultProps: {
    variant: 'main',
  },
};
