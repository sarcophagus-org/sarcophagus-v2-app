import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react';
import { colors } from './colors';
import { components } from './components';
//import { withDefaultButtonVariant } from './components/Button';
import { fonts } from './fonts';
import { styles } from './styles';

const overrides = {
  fonts,
  colors,
  styles,
  components,
};

const withDefaults = [withDefaultColorScheme({ colorScheme: 'brand' })];

export const theme = extendTheme(overrides, ...withDefaults);
