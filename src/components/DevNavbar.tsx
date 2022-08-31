import { Flex, Image } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export function DevNavbar({ children }: { children: React.ReactNode }) {
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
        src="/sarcophagus-logo.png"
        cursor="pointer"
        mr={6}
      />
      {children}
    </Flex>
  );
}
