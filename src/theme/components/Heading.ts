import { ComponentStyleConfig } from '@chakra-ui/react';

export const Heading: ComponentStyleConfig = {
  baseStyle: {
    color: 'brand.950',
  },
  sizes: {
    lg: {
      fontSize: 24,
      fontWeight: 400,
    },
  },
  defaultProps: {
    size: 'lg',
  },
};
