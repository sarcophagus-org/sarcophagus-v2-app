import '@rainbow-me/rainbowkit/styles.css';

import { ChakraProvider } from '@chakra-ui/react';
import * as Sentry from '@sentry/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ErrorFallback } from './components/ErrorFallback';
import { StoreProvider } from './store/StoreProvider';
import { WalletProvider } from 'lib/network/WalletProvider';
import { theme } from './theme';
import { Pages } from './pages';
import { P2PNodeProvider } from 'lib/network/P2PNodeProvider';

function App() {
  return (
    <StoreProvider>
      <ChakraProvider theme={theme}>
        <Sentry.ErrorBoundary fallback={ErrorFallback}>
          <WalletProvider>
            <P2PNodeProvider>
              <Router>
                <Pages />
              </Router>
            </P2PNodeProvider>
          </WalletProvider>
        </Sentry.ErrorBoundary>
      </ChakraProvider>
    </StoreProvider>
  );
}
export default App;
