import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
  ConnectButton,
  darkTheme,
  Theme,
} from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { merge } from 'lodash';

const { chains, provider } = configureChains([chain.mainnet, chain.goerli], [publicProvider()]);

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
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={walletConnectionTheme}
      >
        Sarcophagus v2 Web App
        <ConnectButton />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
export default App;
