import { Flex, Text } from '@chakra-ui/react';
import { ConnectWalletButton } from 'components/ConnectWalletButton';
import { Link, Route, Routes } from 'react-router-dom';
import { DevNavbar } from '../components/DevNavbar';
import { ArchaeologistsPage } from './ArchaeologistsPage';
import { ArweaveTestPage } from './ArweaveTestPage';
import { EmbalmPage } from './EmbalmPage';
import { FreeBondTestPage } from './FreeBondTestPage';
import { RecoverPublicKeyTestPage } from './RecoverPublicKeyTestPage';
import { ThemeTestPage } from './ThemeTestPage';

export function Pages() {
  const routes = [
    {
      path: '/embalm',
      element: <EmbalmPage />,
      label: 'Embalm',
    },
    {
      path: '/arweave',
      element: <ArweaveTestPage />,
      label: 'Arweave Test',
    },
    {
      path: '/theme-test',
      element: <ThemeTestPage />,
      label: 'Theme Test',
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
                key={route.path}
                to={route.path}
              >
                <Text
                  color="brand.500"
                  px={4}
                >
                  {route.label}
                </Text>
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
