import { ChakraProvider } from '@chakra-ui/react';
import { darkTheme, getDefaultWallets, RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { merge } from 'lodash';
import { BrowserRouter as Router } from 'react-router-dom';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { Pages } from './pages';
import { StoreProvider } from './store/StoreProvider';
import { theme } from './theme';
import { ErrorFallback } from './components/ErrorFallback';
import * as Sentry from '@sentry/react';

const { chains, provider } = configureChains(
  [chain.mainnet, chain.goerli, chain.hardhat],
  [publicProvider()]
);

const walletConnectionTheme = merge(darkTheme(), {
  colors: {
    accentColor: '#C4C4C4',
  },
} as Theme);

const { connectors } = getDefaultWallets({
  appName: 'Sarcophagus v2',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function App() {
  return (
    <StoreProvider>
      <ChakraProvider theme={theme}>
        <Sentry.ErrorBoundary fallback={ErrorFallback}>
          <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider
              chains={chains}
              theme={walletConnectionTheme}
              showRecentTransactions={true}
            >
              <Router>
                <Pages />
              </Router>
            </RainbowKitProvider>
          </WagmiConfig>
        </Sentry.ErrorBoundary>
      </ChakraProvider>
    </StoreProvider>
  );
}
export default App;
