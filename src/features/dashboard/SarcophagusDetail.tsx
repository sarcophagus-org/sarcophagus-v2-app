import {
  Flex,
  Text,
  HStack,
  VStack,
  Heading,
  Button,
  Link,
  forwardRef,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { useGetSarcophagusDetails } from 'hooks/viewStateFacet';
import { useRewrapSarcophagus } from 'hooks/embalmerFacet';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import moment from 'moment';
import { BigNumber } from 'ethers';
import { DatePicker } from 'components/DatePicker';
import { Alert } from 'components/Alert';

export function SarcophagusDetail({ id }: { id: string | undefined }) {
  const { sarcophagus } = useGetSarcophagusDetails({ sarcoId: id });
  const { rewrap, resurectionTime, setResurectionTime, isLoading, isRewrapping, isSuccess } =
    useRewrapSarcophagus({
      sarcoId: sarcophagus?.sarcoId,
    });

  const navigate = useNavigate();

  function useQuery() {
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
  }

  function formatDate() {
    if (sarcophagus && sarcophagus.resurrectionTime) {
      const resurectionDuration = (resurection: BigNumber) => {
        const differance = resurection.mul(1000).sub(Date.now());
        return differance.isNegative() ? 'past' : moment.duration(differance.toNumber()).humanize();
      };

      return (
        moment(sarcophagus.resurrectionTime.mul(1000).toNumber()).format('MM.DD.YYYY h:mma') +
        ' (' +
        resurectionDuration(sarcophagus.resurrectionTime) +
        ')'
      );
    } else return '';
  }

  const query = useQuery();
  const currentAction = query.get('action');
  const isRewrap = currentAction === 'rewrap';

  const diggingFee = 25; //TODO: need to calculate digging fee
  const protocalFee = diggingFee * 0.1;

  function handleCustomDateChange(date: Date | null) {
    setResurectionTime(date);
  }

  const maximumResurectionDate =
    sarcophagus && sarcophagus.resurrectionTime
      ? new Date(sarcophagus.resurrectionTime.mul(1000).toNumber())
      : undefined;

  const filterInvalidTime = (time: Date) => {
    const resurectionDate = new Date(maximumResurectionDate || 0).getTime();
    const selectedDate = new Date(time).getTime();

    return resurectionDate >= selectedDate && Date.now() < selectedDate;
  };

  const CustomResurrectionButton = forwardRef(({ value, onClick }, ref) => (
    <Flex>
      <Button
        onClick={onClick}
        ref={ref}
        variant="main"
      >
        {/* this value is an empty string, so this logic evalutate true on null | undefinded | '' */}
        {value ? value : 'Custom Date'}
      </Button>
    </Flex>
  ));

  return (
    <VStack align="left">
      <HStack>
        <Link
          as={NavLink}
          to="/dashboard"
          color="brand.400"
          _hover={{ color: 'brand.950', textDecor: 'underline' }}
        >
          Dashboard
        </Link>
        <Text> / </Text>
        {isRewrap ? (
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
            <Text> / Rewrap</Text>
          </HStack>
        ) : (
          <Text>Details</Text>
        )}
      </HStack>
      <VStack align="left">
        <Heading>{sarcophagus?.name}</Heading>
        <Text
          color="green"
          fontSize="xs"
          pb={6}
        >
          TODO:Status
        </Text>
        {isSuccess ? (
          <Alert status="success">
            <AlertTitle>Rewrap Successful</AlertTitle>
            <AlertDescription>
              <Text as="span">Return to the </Text>
              <Link
                as={NavLink}
                to="/dashboard"
                color="brand.400"
                _hover={{ color: 'brand.950', textDecor: 'underline' }}
              >
                Dashboard
              </Link>
            </AlertDescription>
          </Alert>
        ) : isRewrap ? (
          <VStack
            align="left"
            spacing={8}
            pointerEvents={isRewrapping || isSuccess ? 'none' : 'all'}
          >
            <VStack
              align="left"
              spacing={0}
            >
              <Text>Rewrap</Text>
              <Text variant="secondary">
                Please set a new time when you want your Sarcophagus resurrected.
              </Text>
            </VStack>

            <VStack
              border="1px solid "
              borderColor="violet.700"
              p={6}
              align="left"
              maxW="640px"
            >
              <DatePicker
                selected={resurectionTime}
                onChange={handleCustomDateChange}
                showTimeSelect
                minDate={new Date()}
                maxDate={maximumResurectionDate}
                filterTime={filterInvalidTime}
                showPopperArrow={false}
                timeIntervals={30}
                timeCaption="Time"
                timeFormat="hh:mma"
                dateFormat="MM.dd.yyyy hh:mma"
                fixedHeight
                customInput={<CustomResurrectionButton />}
              />
              <Text variant="secondary">Furthest allowed rewrap time: {formatDate()}</Text>
            </VStack>

            <VStack
              align="left"
              spacing={0}
            >
              <Text>Fees</Text>
              <Text variant="secondary">Digging fee: {diggingFee}</Text>
              <Text variant="secondary">Protocal fee: {protocalFee}</Text>
            </VStack>
            <HStack>
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => rewrap?.()}
                isDisabled={!!!resurectionTime || !rewrap}
                isLoading={isLoading}
              >
                {isRewrapping ? 'Rewrapping...' : 'Rewrap'}
              </Button>
            </HStack>
          </VStack>
        ) : (
          <VStack
            spacing={0}
            align="left"
          >
            <Text>Resurrection Date</Text>
            <Text variant="secondary">{formatDate()}</Text>

            <HStack pt={10}>
              <Button
                as={NavLink}
                to="?action=rewrap"
              >
                Rewrap
              </Button>
              <Button
                as={NavLink}
                to="?action=bury"
              >
                Bury
              </Button>
            </HStack>
          </VStack>
        )}
      </VStack>
    </VStack>
  );
}
