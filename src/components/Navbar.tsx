import { Flex, Image } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SarcoLogo from 'assets/images/sarco-logo.png';

export function Navbar({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  function handleClickLogo() {
    navigate('/');
  }

  return (
    <Flex
      minHeight="70px"
      backgroundColor="brand.50"
      alignItems="center"
      px={6}
    >
      <Image
        onClick={handleClickLogo}
        src={SarcoLogo}
        cursor="pointer"
        mr={6}
        height="44px"
      />
      {children}
    </Flex>
  );
}
