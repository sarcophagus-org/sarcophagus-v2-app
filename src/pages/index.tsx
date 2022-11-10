import { Box, Button, Flex, Link, Text } from '@chakra-ui/react';
import { ConnectWalletButton } from 'components/ConnectWalletButton';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { DevNavbar } from '../components/DevNavbar';
import { ArchaeologistsPage } from './ArchaeologistsPage';
import { DashboardPage } from './DashboardPage';
import { EmbalmPage } from './EmbalmPage';
import { FundBundlrPage } from './FundBundlrPage';
import { TempResurrectionPage } from './TempResurrectionPage';

export function Pages() {
  const routes = [
    {
      path: '/embalm',
      element: <EmbalmPage />,
      noBg: true,
      label: <Flex
        height='40px'
        width='44px'
        alignItems='center'
        borderColor='white'
        borderWidth='1px'
      >
        <Button variant="unstyled" flex={1}>
          <Text fontSize={20}> + </Text>
        </Button>
      </Flex>,
    },
    {
      path: '/dashboard',
      element: <DashboardPage />,
      label: 'Tomb',
    },
    {
      path: '/archaeologists',
      element: <ArchaeologistsPage />,
      label: 'Archaeologists',
    },
    {
      path: '/fundbundlr',
      element: <FundBundlrPage />,
      label: 'Fund Bundlr',
    },
    {
      path: '/temp-resurrection',
      element: <TempResurrectionPage />,
      label: 'TempResurrectionPage',
      hidden: true,
    },
  ];

  return (
    <Flex
      direction="column"
      height="100vh"
      overflow="hidden"
    >
      {/* NavBar */}
      <DevNavbar>
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
                bgColor={route.noBg ? 'transparent' : 'blue.1000'}
                _activeLink={{ color: 'brand.950', bgColor: route.noBg ? 'transparent' : 'blue.700' }}
                _hover={{ textDecor: 'none' }}
                key={route.path}
                to={route.path}
                hidden={route.hidden}
              >
                <Box px={5} py={2.5}>
                  {route.label}
                </Box>
              </Link>
            ))}
          </Flex>
        </Flex>
        <Flex my={3}>
          <ConnectWalletButton />
        </Flex>
      </DevNavbar>

      {/* App Content */}
      <Flex
        flex={1}
        overflow="auto"
      >
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
      </Flex>
    </Flex>
  );
}
