import { Image, Center, Text, Flex, Link } from '@chakra-ui/react';
import anubis from 'assets/images/anubis.png';
import { discordBuildersLink } from 'lib/constants';

// TODO: Get with design for a proper 404 page
export function NotFoundPage() {
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
      </Flex>
    </Center>
  );
}
