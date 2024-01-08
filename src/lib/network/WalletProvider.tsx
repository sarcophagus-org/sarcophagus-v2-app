import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { NetworkConfigProvider } from 'lib/config/NetworkConfigProvider';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { infuraProvider } from 'wagmi/providers/infura';
import { AlchemyProvider } from '@ethersproject/providers';
import { walletConnectionTheme } from '../../theme/walletConnectionTheme';
import { sepolia, mainnet, hardhat, polygonMumbai, arbitrum, polygon } from '@wagmi/core/chains';

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const createAlchemyProvider = (chainId: number) => {
    switch (chainId) {
      case mainnet.id:
        return new AlchemyProvider(chainId, process.env.REACT_APP_ALCHEMY_MAINNET_API_KEY!);
      case sepolia.id:
        return new AlchemyProvider(chainId, process.env.REACT_APP_ALCHEMY_SEPOLIA_API_KEY!);
      case polygon.id:
        return new AlchemyProvider(chainId, process.env.REACT_APP_ALCHEMY_POLYGON_API_KEY!);
      case polygonMumbai.id:
        return new AlchemyProvider(chainId, process.env.REACT_APP_ALCHEMY_POLYGON_MUMBAI_API_KEY!);
      case arbitrum.id:
        return new AlchemyProvider(chainId, process.env.REACT_APP_ALCHEMY_ARBITRUM_API_KEY!);
      default:
        return new AlchemyProvider(chainId);
    }
  };

  const { chains, provider } = configureChains(
    [mainnet, hardhat, sepolia, polygonMumbai, arbitrum, polygon],
    [
      chain => ({
        chain,
        provider: () => createAlchemyProvider(chain.id),
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
