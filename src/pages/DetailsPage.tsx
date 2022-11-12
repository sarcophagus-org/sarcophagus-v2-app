import { Center, Flex } from '@chakra-ui/react';
import { Claim } from 'features/sarcophagi/components/Claim';
import { Details } from 'features/sarcophagi/components/Details';
import { DetailsContainer } from 'features/sarcophagi/components/DetailsContainer';
import { Rewrap } from 'features/sarcophagi/components/Rewrap';
import { useQuery } from 'hooks/useQuery';
import React from 'react';

export function DetailsPage() {
  const query = useQuery();
  const currentAction = query.get('action');

  const actionComponentMap: { [key: string]: React.ReactNode } = {
    rewrap: <Rewrap />,
    claim: <Claim />,
  };

  return (
    <Center
      width="100%"
      height="100%"
    >
      <Flex
        w="50%"
        h="75%"
        maxWidth="1200px"
        minWidth="600px"
        minHeight="400px"
      >
        <DetailsContainer>
          {currentAction ? actionComponentMap[currentAction] : <Details />}
        </DetailsContainer>
      </Flex>
    </Center>
  );
}
