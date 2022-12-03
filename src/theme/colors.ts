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

  // Border and accent colors
  grayBlue: {
    100: '#B6C4D1',
    200: '#8D9AA8',
    300: '#6F7B87',
    400: '#616C78',
    500: '#525C65',
    600: '#434A52',
    700: '#343A40',
    800: '#2A3036',
    900: '#20262D',
  },

  //For Chakra Alerts and Toast, but default the colors are set to these names. 100 color will be the background and 500 is the icon color.
  blue: { 100: '#122435', 500: '#168FFF' },
  green: { 100: '#122D19', 500: '#17CB49' },
  orange: { 100: '#352615', 500: '#FF9F2D' },
  red: { 100: '#331818', 500: '#F74141' },
  yellow: '#FFF72D',
  gray: '#8c8c8c',

  table: {
    textBackground: '#383a4066',
    errorBackground: '#F7414126',
  },

  text: {
    primary: '#FFFFFF', // brand.950
    secondary: '#a6a6a6', // brand.600
    disabled: '#737373', // brand.400
  },

  checkboxScheme: {
    500: '#168FFF',
  },

  //TODO, items from oldColors to be resolved and whitAlpha is still being used in places
  errorHighlight: '#F7414126',
  errorAlt: '#290e0e',

  menuBlue: {
    700: '#343A40',
    1000: '#131416',
  },
};
