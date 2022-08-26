import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react';
import { colors } from './colors';
import { Button, withDefaultButtonVariant } from './components/Button';
import { Heading } from './components/Heading';
import { fonts } from './fonts';
import { styles } from './styles';

const overrides = {
  fonts,
  colors,
  styles,
  components: {
    Button,
    Heading,
  },
};

const withDefaults = [withDefaultColorScheme({ colorScheme: 'brand' }), withDefaultButtonVariant];

export const theme = extendTheme(overrides, ...withDefaults);
