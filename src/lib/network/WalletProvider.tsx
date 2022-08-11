import { darkTheme, getDefaultWallets, RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit';
import { chain as chainList, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { ConfigProvider } from '../config/ConfigProvider';
import { merge } from 'lodash';

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { chains, provider } = configureChains(
    [chainList.mainnet, chainList.goerli, chainList.hardhat],
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

  return (
    <WagmiConfig client={wagmiClient}>
      <ConfigProvider>
        <RainbowKitProvider
          chains={chains}
          theme={walletConnectionTheme}
          showRecentTransactions={true}
          appInfo={{
            appName: 'Sarcophagus V2',
          }}
        >
          {children}
        </RainbowKitProvider>
      </ConfigProvider>
    </WagmiConfig>
  );
}
