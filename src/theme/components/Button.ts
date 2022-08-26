import { withDefaultVariant } from '@chakra-ui/react';

export const Button = {
  variants: {
    main: {
      color: 'brand.0',
      bg: 'brand.950',
      _hover: {
        bg: 'brand.800',
      },
      _active: {
        bg: 'brand.700',
      },
    },
  },
  baseStyle: {
    border: 'none',
    borderRadius: 0,
    fontWeight: 400,
    paddingTop: '20px',
    paddingBottom: '20px',
  },
};

export const withDefaultButtonVariant = withDefaultVariant({
  variant: 'main',
  components: ['Button'],
});
