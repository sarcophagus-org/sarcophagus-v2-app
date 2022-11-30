import { Button, Heading, HStack, Link, Text, VStack } from '@chakra-ui/react';
import { useQuery } from 'hooks/useQuery';
import { useGetSarcophagusDetails } from 'hooks/viewStateFacet';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { SarcoStateIndicator } from './SarcoStateIndicator';
import { RoutesPathMap, RouteKey } from 'pages';
import { getSarcophagusState } from 'lib/utils/sarcophagusState';

interface SarcophagusDetailsProps {
  children?: React.ReactNode;
}

export function DetailsContainer({ children }: SarcophagusDetailsProps) {
  const { id } = useParams();
  const { sarcophagus } = useGetSarcophagusDetails({ sarcoId: id });

  const navigate = useNavigate();

  const query = useQuery();
  const currentAction = query.get('action');

  return (
    <VStack
      align="left"
      w="100%"
    >
      <HStack>
        <Link
          as={NavLink}
          to={RoutesPathMap[RouteKey.DASHBOARD_PAGE]}
          color="brand.400"
          _hover={{ color: 'brand.950', textDecor: 'underline' }}
        >
          Dashboard
        </Link>
        <Text> / </Text>
        {currentAction ? (
          <HStack>
            <Button
              as={Link}
              variant="link"
              onClick={() => navigate(-1)}
              color="brand.400"
              _hover={{ color: 'brand.950', textDecor: 'underline' }}
              textDecor="none"
            >
              Details
            </Button>
            <Text textTransform="capitalize"> / {currentAction}</Text>
          </HStack>
        ) : (
          <Text>Details</Text>
        )}
      </HStack>
      <VStack align="left">
        <VStack
          pb={8}
          align="left"
        >
          <Heading>{sarcophagus?.name}</Heading>
          <SarcoStateIndicator state={getSarcophagusState(sarcophagus)} />
        </VStack>
        {children}
      </VStack>
    </VStack>
  );
}
