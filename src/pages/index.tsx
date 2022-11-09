import { Flex, Link, Text } from '@chakra-ui/react';
import { ConnectWalletButton } from 'components/ConnectWalletButton';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { DevNavbar } from '../components/DevNavbar';
import { ArchaeologistsPage } from './ArchaeologistsPage';
import { DashboardPage } from './DashboardPage';
import { EmbalmPage } from './EmbalmPage';
import { BundlrPage } from './BundlrPage';
import { TempResurrectionPage } from './TempResurrectionPage';

export function Pages() {
  const routes = [
    {
      path: '/embalm',
      element: <EmbalmPage />,
      label: 'Embalm',
    },
    {
      path: '/dashboard',
      element: <DashboardPage />,
      label: 'Dashboard',
    },
    {
      path: '/archaeologists',
      element: <ArchaeologistsPage />,
      label: 'Archaeologists',
    },
    {
      path: '/bundlr',
      element: <BundlrPage />,
      label: 'Bundlr',
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
                _activeLink={{ color: 'brand.950', fontWeight: 'bold' }}
                _hover={{ textDecor: 'none' }}
                key={route.path}
                to={route.path}
                hidden={route.hidden}
              >
                <Text px={4}>{route.label}</Text>
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
