import { Flex, Image, useTheme } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Navbar({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const theme = useTheme();

  function handleClickLogo() {
    navigate('/');
  }

  return (
    <Flex
      minHeight="70px"
      backgroundColor="brand.50"
      alignItems="center"
      px={6}
      boxShadow={`0px 1px 0px ${theme.colors.navBarShadow}`}
    >
      <Image
        onClick={handleClickLogo}
        src="sarco-logo.png"
        cursor="pointer"
        mr={6}
        height="44px"
      />
      {children}
    </Flex>
  );
}
