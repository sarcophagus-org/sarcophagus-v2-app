import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider, darkTheme, Theme } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { merge } from 'lodash';
import { ChakraProvider, HStack } from '@chakra-ui/react';
import Header from './components/Header';
import Body from './components/Body';
import { Routes, Route, BrowserRouter as Router, Link } from 'react-router-dom';
import TestPage from './pages/FreeBondTestPage';
import Home from './pages/Home';

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
  );
}
export default App;
