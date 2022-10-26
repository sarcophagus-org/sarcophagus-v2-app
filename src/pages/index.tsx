import { Flex, Text } from '@chakra-ui/react';
import { ConnectWalletButton } from 'components/ConnectWalletButton';
import { NavLink, Route, Routes, Navigate } from 'react-router-dom';
import { DevNavbar } from '../components/DevNavbar';
import { EmbalmPage } from './EmbalmPage';
import { DashboardPage } from './DashboardPage';
import { FundBundlrPage } from './FundBundlrPage';
import { ArchaeologistsPage } from './ArchaeologistsPage';

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
      path: '/fundbundlr',
      element: <FundBundlrPage />,
      label: 'Fund Bundlr',
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
              <NavLink
                key={route.path}
                to={route.path}
                className={({ isActive }) => (isActive ? 'activeLink' : 'inactiveLink')}
              >
                <Text px={4}>{route.label}</Text>
              </NavLink>
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
