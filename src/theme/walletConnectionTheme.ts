import { darkTheme, Theme } from '@rainbow-me/rainbowkit';
import { merge } from 'lodash';
import { colors } from './colors';
import { fonts } from './fonts';

export const walletConnectionTheme = merge(darkTheme({ overlayBlur: 'small' }), {
  colors: {
    accentColor: colors.brand['950'],
    accentColorForeground: colors.brand['0'],
    closeButtonBackground: 'none',
    connectButtonBackgroundError: colors.red,
    error: colors.red,
    generalBorder: colors.brand['500'],
    generalBorderDim: colors.brand['500'],
    menuItemBackground: colors.brand['0'],
    modalBackground: colors.brand['0'],
    modalBorder: colors.brand['500'],
  },
  fonts: {
    body: fonts.body,
  },
  radii: {
    actionButton: '0',
    connectButton: '0',
    menuButton: '0',
    modal: '0',
    modalMobile: '0',
  },
} as Theme);
