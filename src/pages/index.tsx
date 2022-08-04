import { Box, Center, Text } from '@chakra-ui/react';
import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { DevNavbar } from '../components/DevNavbar';
import Home from '../pages/Home';
import { ArchaeologistsPage } from './ArchaeologistsPage';
import { FreeBondTestPage } from './FreeBondTestPage';

export function Pages() {
  const routes = [
    {
      path: '/',
      element: <Home />,
      label: 'Home',
    },
    {
      path: '/archaeologists',
      element: <ArchaeologistsPage />,
      label: 'Archaeologists',
    },
    {
      path: '/free-bond-test',
      element: <FreeBondTestPage />,
      label: 'Free Bond Test',
    },
  ];

  return (
    <React.Fragment>
      <DevNavbar>
        {routes.map(route => (
          <Link
            key={route.path}
            to={route.path}
          >
            <Text px={4}>{route.label}</Text>
          </Link>
        ))}
      </DevNavbar>
      <Center>
        <Box
          width="50%"
          minWidth={900}
          pt={8}
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
        </Box>
      </Center>
    </React.Fragment>
  );
}
