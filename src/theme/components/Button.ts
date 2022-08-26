import { withDefaultVariant } from '@chakra-ui/react';

export const Button = {
  variants: {
    main: {
      color: 'brand.950',
      bg: 'brand.0',
      _hover: {
        bg: 'brand.100',
      },
      _active: {
        bg: 'brand.200',
      },
    },
  },
  baseStyle: {
    border: 'none',
    borderRadius: 0,
    fontWeight: 400,
  },
};

export const withDefaultButtonVariant = withDefaultVariant({
  variant: 'main',
  components: ['Button'],
});
