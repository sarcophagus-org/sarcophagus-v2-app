import { Box, Button, Flex, Link, Text, Heading, Image, Container } from '@chakra-ui/react';
import { ConnectWalletButton } from 'components/ConnectWalletButton';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Navigate, NavLink, Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { ArchaeologistsPage } from './ArchaeologistsPage';
import { DashboardPage } from './DashboardPage';
import { DetailsPage } from './DetailsPage';
import { EmbalmPage } from './EmbalmPage';
import { BundlrPage } from './BundlrPage';
import { TempResurrectionPage } from './TempResurrectionPage';
import pharaoh from 'assets/images/pharaoh.gif';
import { useSupportedNetwork } from 'lib/config/useSupportedNetwork';
import { SarcophagusCreatedPage } from './SarcophagusCreatedPage';
import { NotFoundPage } from './NotFoundPage';

export enum RouteKey {
  EMBALM_PAGE,
  DASHBOARD_PAGE,
  DASHBOARD_DETAIL,
  ARCHEOLOGIST_PAGE,
  BUNDLER_PAGE,
  TEMP_RESURRECTION_PAGE,
  SARCOPHAGUS_CREATED,
}

export const RoutesPathMap: { [key: number]: string } = {
  [RouteKey.EMBALM_PAGE]: '/embalm',
  [RouteKey.DASHBOARD_PAGE]: '/dashboard',
  [RouteKey.DASHBOARD_DETAIL]: '/dashboard/:id',
  [RouteKey.ARCHEOLOGIST_PAGE]: '/archaeologists',
  [RouteKey.BUNDLER_PAGE]: '/fundbundlr',
  [RouteKey.TEMP_RESURRECTION_PAGE]: '/temp-resurrection',
  [RouteKey.SARCOPHAGUS_CREATED]: '/sarcophagus-created',
};

export function Pages() {
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
    },
    {
      path: RoutesPathMap[RouteKey.DASHBOARD_PAGE],
      element: <DashboardPage />,
      label: 'Tomb',
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
    },
    {
      path: RoutesPathMap[RouteKey.BUNDLER_PAGE],
      element: <BundlrPage />,
      label: 'Bundlr',
    },
    {
      path: RoutesPathMap[RouteKey.TEMP_RESURRECTION_PAGE],
      element: <TempResurrectionPage />,
      label: 'TempResurrectionPage',
      hidden: true,
    },
    {
      path: RoutesPathMap[RouteKey.SARCOPHAGUS_CREATED],
      element: <SarcophagusCreatedPage />,
      label: '',
      hidden: true,
    },
  ];

  const { isConnected } = useAccount();

  const { isSupportedChain, supportedNetworkNames } = useSupportedNetwork();

  const { openConnectModal } = useConnectModal();

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
                  bgColor={route.noBackground ? 'transparent' : 'blue.1000'}
                  _activeLink={{
                    color: 'brand.950',
                    bgColor: route.noBackground ? 'transparent' : 'blue.700',
                  }}
                  _hover={{ textDecor: 'none', color: 'brand.700' }}
                  key={route.path}
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
            <Container
              maxW="sm"
              centerContent
            >
              <Heading pb={2}>
                {!isConnected ? 'No Wallet Detected' : 'Unsupported Network'}
              </Heading>
              <Text align="center">
                {!isConnected
                  ? 'Please connect to your web3 wallet to access this dapp.'
                  : 'Please connect to a supported network.'}
              </Text>
              <Image
                src={pharaoh}
                w="125px"
                py={8}
              />
              {!isConnected ? (
                <Button onClick={openConnectModal}>Connect Wallet</Button>
              ) : (
                <Text
                  align="center"
                  fontWeight="bold"
                >
                  Supported Networks
                  {supportedNetworkNames.map(network => (
                    <Text
                      fontWeight="normal"
                      key={network}
                    >
                      {network}
                    </Text>
                  ))}
                </Text>
              )}
            </Container>
          )}
        </Flex>
      </Flex>
    </Router>
  );
}
