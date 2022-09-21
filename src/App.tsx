import '@rainbow-me/rainbowkit/styles.css';

import { ChakraProvider } from '@chakra-ui/react';
import * as Sentry from '@sentry/react';
import { P2PNodeProvider } from 'lib/network/P2PNodeProvider';
import { WalletProvider } from 'lib/network/WalletProvider';
import { BrowserRouter as Router } from 'react-router-dom';
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
