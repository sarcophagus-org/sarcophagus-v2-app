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
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './components/ErrorFallback';

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
        <ErrorBoundary FallbackComponent={ErrorFallback}>
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
        </ErrorBoundary>
      </ChakraProvider>
    </StoreProvider>
  );
}
export default App;
