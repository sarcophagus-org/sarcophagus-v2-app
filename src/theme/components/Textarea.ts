import { ComponentStyleConfig } from '@chakra-ui/react';
import { styles } from '../styles';

export const Textarea: ComponentStyleConfig = {
  variants: {
    main: {
      bg: 'brand.0',
      border: '1px',
      borderRadius: 0,
      borderColor: 'brand.950',
      marginTop: 1,
      fontSize: styles.global.body.fontSize,
      _disabled: {
        borderColor: 'brand.300',
        color: 'brand.300',
      },
      _placeholder: { color: 'text.secondary' },
    },
  },
  defaultProps: {
    variant: 'main',
  },
};
