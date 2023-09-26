import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { NetworkConfigProvider } from 'lib/config/NetworkConfigProvider';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { infuraProvider } from 'wagmi/providers/infura';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { walletConnectionTheme } from '../../theme/walletConnectionTheme';
import { sepolia, mainnet, goerli, hardhat } from '@wagmi/core/chains';

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { chains, provider } = configureChains(
    [mainnet, goerli, hardhat, sepolia],
    [
      jsonRpcProvider({
        rpc: () => ({
          http: `https://eth-sepolia.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY!}`,
        }),
        priority: 0,
      }),
      infuraProvider({ apiKey: process.env.REACT_APP_INFURA_API_KEY!, priority: 1 }),
      publicProvider({ priority: 2 }),
    ]
  );

  const { connectors } = getDefaultWallets({
    appName: 'Sarcophagus v2',
    projectId: '82c7fb000145342f2d1b57dc2d83d001', // TODO: Update this
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <NetworkConfigProvider>
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
      </NetworkConfigProvider>
    </WagmiConfig>
  );
}
