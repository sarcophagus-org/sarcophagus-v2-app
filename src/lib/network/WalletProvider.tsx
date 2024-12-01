import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { NetworkConfigProvider } from 'lib/config/NetworkConfigProvider';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { walletConnectionTheme } from '../../theme/walletConnectionTheme';
import { sepolia, mainnet, hardhat, polygonMumbai, arbitrum, polygon } from '@wagmi/core/chains';
import { base } from '@wagmi/chains';
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc';

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const createRpcProvider = (chainId: number) => {
    switch (chainId) {
      case mainnet.id:
        return {
          http: `https://eth-mainnet.g.alchemy.com/v2/${process.env
            .REACT_APP_ALCHEMY_MAINNET_API_KEY!}`,
        };
      case sepolia.id:
        return {
          http: `https://eth-sepolia.g.alchemy.com/v2/${process.env
            .REACT_APP_ALCHEMY_SEPOLIA_API_KEY!}`,
        };
      case polygon.id:
        return {
          http: `https://polygon-mainnet.g.alchemy.com/v2/${process.env
            .REACT_APP_ALCHEMY_POLYGON_API_KEY!}`,
        };
      case polygonMumbai.id:
        return {
          http: `https://polygon-mumbai.g.alchemy.com/v2/${process.env
            .REACT_APP_ALCHEMY_POLYGON_MUMBAI_API_KEY!}`,
        };
      case arbitrum.id:
        return {
          http: `https://arb-mainnet.g.alchemy.com/v2/${process.env
            .REACT_APP_ALCHEMY_ARBITRUM_API_KEY!}`,
        };
      case base.id:
        return {
          http: `https://base-mainnet.g.alchemy.com/v2/${process.env
            .REACT_APP_ALCHEMY_BASE_MAINNET_API_KEY!}`,
        };
      default:
        return {
          http: `https://base-mainnet.g.alchemy.com/v2/${process.env
            .REACT_APP_ALCHEMY_BASE_MAINNET_API_KEY!}`,
        };
    }
  };

  const { chains, provider } = configureChains(
    [mainnet, hardhat, sepolia, polygonMumbai, arbitrum, polygon, base],
    [
      jsonRpcProvider({
        rpc: chain => createRpcProvider(chain.id),
      }),
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
