import { Box, Button, Flex, Link, Text, VStack, Heading } from '@chakra-ui/react';
import { ConnectWalletButton } from 'components/ConnectWalletButton';
import { Navigate, NavLink, Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { ArchaeologistsPage } from './ArchaeologistsPage';
import { DashboardPage } from './DashboardPage';
import { EmbalmPage } from './EmbalmPage';
import { FundBundlrPage } from './FundBundlrPage';
import { TempResurrectionPage } from './TempResurrectionPage';
import { useNetworkConfig } from 'lib/config';
import { networkConfigs } from 'lib/config/networkConfig';
import { useAccount } from 'wagmi';

export enum RouteKey {
  EMBALM_PAGE,
  DASHBOARD_PAGE,
  DASHBOARD_DETAIL,
  ARCHEOLOGIST_PAGE,
  BUNDLER_PAGE,
  TEMP_RESURRECTION_PAGE,
}

export const RoutesPathMap: { [key: number]: string } = {
  [RouteKey.EMBALM_PAGE]: '/embalm',
  [RouteKey.DASHBOARD_PAGE]: '/dashboard',
  [RouteKey.DASHBOARD_DETAIL]: '/dashboard/:id',
  [RouteKey.ARCHEOLOGIST_PAGE]: '/archaeologists',
  [RouteKey.BUNDLER_PAGE]: '/fundbundlr',
  [RouteKey.TEMP_RESURRECTION_PAGE]: '/temp-resurrection',
};

export function Pages() {
  const routes = [
    {
      path: RoutesPathMap[RouteKey.EMBALM_PAGE],
      element: <EmbalmPage />,
      noBg: true,
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
    },
    {
      path: RoutesPathMap[RouteKey.DASHBOARD_PAGE],
      element: <DashboardPage />,
      label: 'Tomb',
    },
    {
      path: RoutesPathMap[RouteKey.DASHBOARD_DETAIL],
      element: <DashboardPage />,
      label: 'Dashboard',
      hidden: true,
    },
    {
      path: RoutesPathMap[RouteKey.ARCHEOLOGIST_PAGE],
      element: <ArchaeologistsPage />,
      label: 'Archaeologists',
    },
    {
      path: RoutesPathMap[RouteKey.BUNDLER_PAGE],
      element: <FundBundlrPage />,
      label: 'Fund Bundlr',
    },
    {
      path: RoutesPathMap[RouteKey.TEMP_RESURRECTION_PAGE],
      element: <TempResurrectionPage />,
      label: 'TempResurrectionPage',
      hidden: true,
    },
  ];

  const { isConnected } = useAccount();

  const supportedChainIds =
    process.env.REACT_APP_SUPPORTED_CHAIN_IDS?.split(',').map(id => parseInt(id)) || [];
  const networkConfig = useNetworkConfig();

  const supportedNetworkNames = Object.values(networkConfigs)
    .filter(config => supportedChainIds.includes(config.chainId))
    .map(config => config.networkShortName);

  const isSupportedChain =
    networkConfig === undefined || !supportedChainIds.includes(networkConfig.chainId);

  return (
    <Router>
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
                <Link
                  textDecor="bold"
                  as={NavLink}
                  mx={1.5}
                  bg={route.noBg ? 'transparent' : 'blue.1000'}
                  _activeLink={{
                    color: 'brand.950',
                    bgColor: route.noBg ? 'transparent' : 'blue.700',
                  }}
                  _hover={{ textDecor: 'none', color: 'brand.700' }}
                  key={route.path}
                  to={route.path}
                  hidden={route.hidden}
                >
                  <Box
                    px={route.noBg ? 0 : 5}
                    py={route.noBg ? 0 : 2.5}
                  >
                    {route.label}
                  </Box>
                </Link>
              ))}
            </Flex>
          </Flex>
          <Flex my={3}>
            <ConnectWalletButton />
          </Flex>
        </Navbar>

        {/* App Content */}
        <Flex
          flex={1}
          overflow="auto"
        >
          {!isConnected ? (
            <Text>Not connected man</Text>
          ) : isSupportedChain ? (
            <VStack>
              <Heading>You are connected on an unsupported Network</Heading>
              <Text>Supported Networks</Text>
              {supportedNetworkNames.map(network => (
                <Text key={network}>{network}</Text>
              ))}
            </VStack>
          ) : (
            <Routes>
              <Route
                path="/"
                element={<Navigate to="/dashboard" />}
              />
              {routes.map(route => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Routes>
          )}
        </Flex>
      </Flex>
    </Router>
  );
}
