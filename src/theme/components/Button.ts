import { withDefaultVariant } from '@chakra-ui/react';

export const Button = {
  variants: {
    main: {
      _hover: {
        bg: 'brand.800',
        _disabled: {
          bg: 'brand.950',
        },
      },
      _active: {
        bg: 'brand.700',
      },
    },
    ghost: {
      fontWeight: 400,
      fontSize: 14,
      _hover: {
        bg: 'brand.200',
      },
    },
    link: {
      color: 'brand.950',
      bg: 'brand.0',
      textDecoration: 'underline',
      fontSize: 'sm',
    },
    outline: {
      color: 'brand.900',
    },
    disabledLook: {
      opacity: 0.4,
    },
  },
  baseStyle: {
    color: 'brand.0',
    bg: 'brand.950',
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
