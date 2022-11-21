import { Image, Center, Text, Flex, Link, Button } from '@chakra-ui/react';
import anubis from 'assets/images/anubis.png';
import { discordBuildersLink } from 'lib/constants';
import { RouteKey, RoutesPathMap } from 'pages';
import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Center
      h="50%"
      minHeight="300px"
    >
      <Flex
        w="500px"
        direction="column"
        align="center"
      >
        <Image
          w="125px"
          src={anubis}
        />
        <Text
          mt={3}
          fontSize="3xl"
        >
          404 Page Not Found
        </Text>
        <Text
          mt={3}
          textAlign="center"
        >
          This page does not exist. You may have mistyped the address or it has been moved to
          another URL. If you think this is an error, please{' '}
          <Link
            href={discordBuildersLink}
            target="_blank"
            textDecor="underline"
          >
            contact our support team
          </Link>
          .
        </Text>
        <Button
          onClick={() => {
            navigate(RoutesPathMap[RouteKey.DASHBOARD_PAGE]);
          }}
          mt={6}
        >
          Return Home
        </Button>
      </Flex>
    </Center>
  );
}
