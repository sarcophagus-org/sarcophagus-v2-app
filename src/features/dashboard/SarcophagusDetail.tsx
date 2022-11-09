import {
  Flex,
  Text,
  HStack,
  VStack,
  Heading,
  Input,
  Button,
  Link,
  forwardRef,
} from '@chakra-ui/react';
import { formatAddress } from 'lib/utils/helpers';
import { useGetSarcophagusDetails } from 'hooks/viewStateFacet';
import { useRewrapSarcophagus } from 'hooks/embalmerFacet';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import moment from 'moment';
import { BigNumber } from 'ethers';
import { DatePicker } from 'components/DatePicker';

export function SarcophagusDetail({ id }: { id: string | undefined }) {
  const { sarcophagus } = useGetSarcophagusDetails({ sarcoId: id });
  const { write, resurectionTime, setResurectionTime } = useRewrapSarcophagus({
    sarcoId: sarcophagus?.sarcoId,
  });

  const [customResurrectionDate, setCustomResurrectionDate] = useState<Date | null>(null);
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

  const diggingFee = 25;
  const protocalFee = diggingFee * 0.1;

  function handleCustomDateChange(date: Date | null) {
    setCustomResurrectionDate(date);
  }

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
            >
              Details
            </Button>
            <Text> / Rewarp</Text>
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
        >
          TODO:Status
        </Text>
        {isRewrap ? (
          <VStack align="left">
            <Text>Rewrap</Text>
            <Text variant="secondary">
              Please set a new time when you want your Sarcophagus resurrected.
            </Text>
            <VStack
              border="1px solid "
              borderColor="violet.700"
              p={6}
              align="left"
            >
              <DatePicker
                selected={customResurrectionDate}
                onChange={handleCustomDateChange}
                //                onInputClick={handleCustomDateClick}
                showTimeSelect
                minDate={new Date()}
                showPopperArrow={false}
                timeFormat="HH:mm"
                timeIntervals={30}
                timeCaption="Time"
                dateFormat="MM/dd/yyyy HH:mm"
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
              <Text variant="secondary">Digging fee TODO: {diggingFee}</Text>
              <Text variant="secondary">Protocal fee: {protocalFee}</Text>
            </VStack>
          </VStack>
        ) : (
          <VStack
            pt={8}
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
