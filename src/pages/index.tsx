import { Box, Button, Flex, Link, Text, Tooltip } from '@chakra-ui/react';
import { ConnectWalletButton } from 'components/ConnectWalletButton';
import { useAccount, useNetwork } from 'wagmi';
import { Navigate, NavLink, Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { ArchaeologistsPage } from './ArchaeologistsPage';
import { DashboardPage } from './DashboardPage';
import { DetailsPage } from './DetailsPage';
import { EmbalmPage } from './EmbalmPage';
import { BundlrPage } from './BundlrPage';
import { TempResurrectionPage } from './TempResurrectionPage';
import { RecipientsPage } from './RecipientsPage';
import { ThemeTestPage } from './ThemeTestPage';
import { useSupportedNetwork } from 'lib/config/useSupportedNetwork';
import { SarcophagusCreatedPage } from './SarcophagusCreatedPage';
import { NotFoundPage } from './NotFoundPage';
import { CreateSarcophagusContextProvider } from 'features/embalm/stepContent/context/CreateSarcophagusContext';
import { WalletDisconnectPage } from './WalletDisconnectPage';
import { useBundlrSession } from 'features/embalm/stepContent/hooks/useBundlrSession';
import { AccusePage } from './AccusePage';
import { AdminDashBoardPage } from './AdminDashboardPage';
import { useTimestampMs } from 'hooks/useTimestampMs';
import { useEffect } from 'react';
import { sarco } from 'sarcophagus-v2-sdk';
import { useNetworkConfig } from 'lib/config';

export enum RouteKey {
  ARCHEOLOGIST_PAGE,
  BUNDLER_PAGE,
  DASHBOARD_DETAIL,
  DASHBOARD_PAGE,
  EMBALM_PAGE,
  RECIPIENTS,
  TEMP_RESURRECTION_PAGE,
  SARCOPHAGUS_CREATED,
  THEME_TEST_PAGE,
  ACCUSE_PAGE,
  ADMIN_DASHBOARD_PAGE,
}

export const RoutesPathMap: { [key: number]: string } = {
  [RouteKey.ARCHEOLOGIST_PAGE]: '/archaeologists',
  [RouteKey.BUNDLER_PAGE]: '/fundbundlr',
  [RouteKey.DASHBOARD_DETAIL]: '/dashboard/:id',
  [RouteKey.DASHBOARD_PAGE]: '/dashboard',
  [RouteKey.EMBALM_PAGE]: '/embalm',
  [RouteKey.RECIPIENTS]: '/recipients',
  [RouteKey.TEMP_RESURRECTION_PAGE]: '/temp-resurrection',
  [RouteKey.SARCOPHAGUS_CREATED]: '/sarcophagus-created',
  [RouteKey.THEME_TEST_PAGE]: '/theme-test',
  [RouteKey.ACCUSE_PAGE]: '/accuse',
  [RouteKey.ADMIN_DASHBOARD_PAGE]: '/admin-dashboard',
};

export function Pages() {
  const network = useNetwork();
  const networkConfig = useNetworkConfig();

  useEffect(() => {
    if (!network.chain || sarco.isInitialised || !networkConfig.providerUrl) {
      return;
    }

    sarco.init({
      chainId: network.chain.id,
      providerUrl: networkConfig.providerUrl,
      etherscanApiKey: networkConfig.etherscanApiKey,
    });
  }, [network.chain, networkConfig.etherscanApiKey, networkConfig.providerUrl]);

  const routes = [
    {
      path: RoutesPathMap[RouteKey.EMBALM_PAGE],
      element: <EmbalmPage />,
      noBackground: true,
      label: (
        <Flex
          height="40px"
          width="44px"
          alignItems="center"
          borderColor="white"
          borderWidth="1px"
        >
          <Button
            variant="unstyled"
            flex={1}
          >
            <Text fontSize={20}> + </Text>
          </Button>
        </Flex>
      ),
      tooltip: 'Create a new Sarcophagus',
    },
    {
      path: RoutesPathMap[RouteKey.DASHBOARD_PAGE],
      element: <DashboardPage />,
      label: 'Tomb',
      tooltip: 'View your Sarcophagi',
    },
    {
      path: RoutesPathMap[RouteKey.DASHBOARD_DETAIL],
      element: <DetailsPage />,
      label: 'Dashboard',
      hidden: true,
    },
    {
      path: RoutesPathMap[RouteKey.ARCHEOLOGIST_PAGE],
      element: <ArchaeologistsPage />,
      label: 'Archaeologists',
      tooltip: 'View all registered archaeologists that are online',
    },
    {
      path: RoutesPathMap[RouteKey.ACCUSE_PAGE],
      element: <AccusePage />,
      label: 'Accuse',
    },
    {
      path: RoutesPathMap[RouteKey.BUNDLER_PAGE],
      element: <BundlrPage />,
      label: 'Bundlr',
      tooltip: 'Fund or withdraw from your Bundlr account',
    },
    {
      path: RoutesPathMap[RouteKey.TEMP_RESURRECTION_PAGE],
      element: <TempResurrectionPage />,
      label: 'TempResurrectionPage',
      hidden: true,
    },
    {
      path: RoutesPathMap[RouteKey.RECIPIENTS],
      element: <RecipientsPage />,
      label: 'Recipients',
      tooltip: 'Derive a recipient public key from your connected wallet',
    },
    {
      path: RoutesPathMap[RouteKey.SARCOPHAGUS_CREATED],
      element: <SarcophagusCreatedPage />,
      label: '',
      hidden: true,
    },
    {
      path: RoutesPathMap[RouteKey.THEME_TEST_PAGE],
      element: <ThemeTestPage />,
      label: '',
      hidden: true,
    },
    {
      path: RoutesPathMap[RouteKey.ADMIN_DASHBOARD_PAGE],
      element: <AdminDashBoardPage />,
      label: '',
      hidden: true,
    },
  ];

  const { isConnected } = useAccount();

  // Handles Bundlr connection and disconnection
  useBundlrSession();

  // Globally stores the timestamp from the latest block
  useTimestampMs();

  const { isSupportedChain } = useSupportedNetwork();
  const currentCommitHash = process.env.REACT_APP_COMMIT_REF;

  return (
    <Router>
      {currentCommitHash && (
        <Text
          position={'fixed'}
          right={3}
          bottom={3}
          variant="secondary"
          fontSize="xs"
        >
          {currentCommitHash}
        </Text>
      )}
      <Flex
        direction="column"
        height="100vh"
        overflow="hidden"
      >
        <Navbar>
          <Flex
            justifyContent="space-between"
            width="100%"
          >
            <Flex alignItems="center">
              {routes.map(route => (
                <Tooltip
                  isDisabled={!route.tooltip}
                  label={route.tooltip}
                  openDelay={300}
                  key={route.path}
                >
                  <Link
                    textDecor="bold"
                    as={NavLink}
                    mx={1.5}
                    bgColor={route.noBackground ? 'transparent' : 'blue.1000'}
                    _activeLink={{
                      color: 'brand.950',
                      bgColor: route.noBackground ? 'transparent' : 'blue.700',
                    }}
                    _hover={{ textDecor: 'none', color: 'brand.700' }}
                    to={route.path}
                    hidden={route.hidden}
                  >
                    <Box
                      px={route.noBackground ? 0 : 5}
                      py={route.noBackground ? 0 : 2.5}
                    >
                      {route.label}
                    </Box>
                  </Link>
                </Tooltip>
              ))}
            </Flex>
          </Flex>
          <Flex my={3}>
            <ConnectWalletButton />
          </Flex>
        </Navbar>
        {/* App Content */}
        <Flex
          overflow="auto"
          direction="column"
          width="100%"
          height="100%"
          pt={50}
        >
          {isConnected && isSupportedChain ? (
            <Routes>
              <Route
                path="/"
                element={<Navigate to={RoutesPathMap[RouteKey.DASHBOARD_PAGE]} />}
              />
              {routes.map(route => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
              <Route
                path="*"
                element={<NotFoundPage />}
              />
            </Routes>
          ) : (
            <CreateSarcophagusContextProvider>
              <WalletDisconnectPage />
            </CreateSarcophagusContextProvider>
          )}
        </Flex>
      </Flex>
    </Router>
  );
}
