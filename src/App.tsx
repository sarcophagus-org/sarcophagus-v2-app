import '@rainbow-me/rainbowkit/styles.css';

import { ChakraProvider } from '@chakra-ui/react';
import * as Sentry from '@sentry/react';
import { WalletProvider } from 'lib/network/WalletProvider';

import { ErrorFallback } from './components/ErrorFallback';
import { Pages } from './pages';
import { StoreProvider } from './store/StoreProvider';
import { theme } from './theme';

function App() {
  return (
    <StoreProvider>
      <ChakraProvider theme={theme}>
        <Sentry.ErrorBoundary fallback={ErrorFallback}>
          <WalletProvider>
            <Pages />
          </WalletProvider>
        </Sentry.ErrorBoundary>
      </ChakraProvider>
    </StoreProvider>
  );
}
export default App;
