import { ChakraProvider } from '@chakra-ui/react';
import { darkTheme, getDefaultWallets, RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { merge } from 'lodash';
import { BrowserRouter as Router } from 'react-router-dom';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import Body from './components/Body';
import Header from './components/Header';
import { StoreProvider } from './store/StoreProvider';

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
      <ChakraProvider>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider
            chains={chains}
            theme={walletConnectionTheme}
            showRecentTransactions={true}
          >
            <Router>
              <Header />
              <Body />
            </Router>
          </RainbowKitProvider>
        </WagmiConfig>
      </ChakraProvider>
    </StoreProvider>
  );
}
export default App;
