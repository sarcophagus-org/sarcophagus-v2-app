import {
  Flex,
  VStack,
  Text,
  useTab,
  IconButton,
  TabList,
  TabPanels,
  TabPanel,
  Tabs,
  TabProps,
  useStyleConfig,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import { formatAddress, parseSarcophagusState } from 'lib/utils/helpers';
import useSarcophagi from 'hooks/useSarcophagi';
import { useGetGracePeriod } from 'hooks/viewStateFacet';

interface TabData {
  label: string;
  value: string;
  component: JSX.Element;
}

interface MyTabProps extends TabProps {
  data: TabData;
}
export function Dashboard() {
  const { sarcophagi, updateSarcophagi } = useSarcophagi();
  const gracePeriod = useGetGracePeriod();

  function CustomTab(props: MyTabProps) {
    const tabProps = useTab(props);
    const isSelected = tabProps['aria-selected'];
    const styles = useStyleConfig('Tab');

    return (
      <VStack
        flexGrow="1"
        flexShrink="1"
        flexBasis="0px"
        align="left"
        border="1px solid"
        borderColor={isSelected ? 'brand.950' : 'brand.200'}
        borderRadius={0}
        px={4}
        py={3}
        m={2}
        bgGradient="linear(to-b, brand.0, #202020)"
        sx={styles}
        {...tabProps}
      >
        <Text
          lineHeight={1}
          fontSize="11px"
          color="brand.700"
        >
          {props.data.label}
        </Text>
        <Text
          fontSize="18px"
          lineHeight={1}
        >
          {props.data.value}
        </Text>
      </VStack>
    );
  }

  const tabData: TabData[] = [
    {
      label: 'SARCOPHAGI',
      value: '0',
      component: (
        <VStack>
          <IconButton
            alignSelf="flex-end"
            size="sm"
            variant="ghost"
            aria-label="Previous page"
            icon={<RepeatIcon />}
            onClick={updateSarcophagi}
          />
          <TableContainer
            width="100%"
            overflowY="auto"
            maxHeight="650px"
          >
            <Table>
              <Thead>
                <Tr>
                  <Th>Sarco ID</Th>
                  <Th>Name</Th>
                  <Th>State</Th>
                </Tr>
              </Thead>
              <Tbody>
                {sarcophagi.map((s, index) => (
                  <Tr key={index}>
                    <Td>{formatAddress(s.sarcoId)}</Td>
                    <Td>{s.name}</Td>
                    <Td>{parseSarcophagusState(s, gracePeriod)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </VStack>
      ),
    },
    {
      label: 'RESURRECTED',
      value: '0',
      component: <Flex>RESURRECTED</Flex>,
    },
    {
      label: 'ARCHIVED',
      value: '0',
      component: <Flex>ARCHIVED</Flex>,
    },
    {
      label: 'BALANCE',
      value: '1000 SARCO',
      component: <Flex>BALANCE</Flex>,
    },
  ];

  return (
    <Flex
      ml="84px"
      w="65%"
      py="48px"
      minWidth="700px"
      direction="column"
      height="100%"
    >
      <Tabs variant="unstyled">
        <TabList justifyContent="space-between">
          {tabData.map((tab, index) => (
            <CustomTab
              key={index}
              data={tab}
            >
              {tab.label}
            </CustomTab>
          ))}
        </TabList>
        <TabPanels>
          {tabData.map((tab, index) => (
            <TabPanel
              m={2}
              border="1px solid #404040"
              bgGradient="linear(to-b, brand.0, #202020)"
              key={index}
            >
              <Flex
                justify="center"
                bg="brand.300"
              >
                <Text>{tab.label}</Text>
              </Flex>
              {tab.component}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
