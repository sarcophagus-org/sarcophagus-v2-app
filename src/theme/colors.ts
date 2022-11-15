// Contains all the colors used by the sarcophagus app

export const colors = {
  // Main brand colors
  // Colors from black to white, lowest number being the darkest and highest number being the
  // lightest
  brand: {
    0: '#000000',
    50: '#0d0d0d',
    100: '#262626',
    200: '#404040',
    300: '#595959',
    400: '#737373',
    500: '#8c8c8c',
    600: '#a6a6a6',
    700: '#bfbfbf',
    800: '#d9d9d9',
    900: '#f2f2f2',
    950: '#ffffff',
  },

  // Violet colors for some borders and some secondary text. Only a couple of these are used.
  violet: {
    50: '#f3f0f9',
    100: '#d7d5dd',
    200: '#bdb9c4',
    300: '#a29dac',
    400: '#878194',
    500: '#6e687b',
    600: '#565160',
    700: '#3e3945',
    800: '#25222a',
    900: '#0d0a12',
  },

  // Menu Colors
  blue: {
    700: '#343A40',
    1000: '#131416',
  },

  // TODO: Merge the two error colors, check with design team
  error: '#c88484',
  errorBg: '#2f1414',
  errorAlt: '#290e0e',
  errorHighlight: '#F7414126',
  warning: '#c8c884',
  success: '#84c884',
  info: '#84bcc8',
  disabled: '#737373', // Same as brand.400
  navBarShadow: '#29262F',

  // WARNING: This color is an abomination and should not be used! But we're using it anyway.
  controversialBlue: '#168FFF',

  // Used specifically for the sarcophagus table
  // Note that there are duplicate colors through the app because the colors in the designs have
  // changed over time. These colors need to be standardized.
  // TODO: Get with design to standardize some of these colors.
  blueBg: '#102233',
  red: '#F74141',
  redBg: '#2f1414',
  green: '#17CB49',
  greenBg: '#0b2613',
  yellow: '#FF9F2D',
  yellowBg: '#342615',
};
