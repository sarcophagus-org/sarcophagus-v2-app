import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { BigNumber, ethers, utils } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { split, combine } from 'shamirs-secret-sharing-ts';
import { useAccount } from 'wagmi';
import useArweaveService from '../hooks/useArweaveService';
import useFileEncryption from '../hooks/useFileEncryption';
import useSarcophagi from '../hooks/useSarcophagi';
import { useSubmitTransaction } from '../hooks/useSubmitTransactions';
import { EmbalmerFacet } from '../abi/EmbalmerFacet';
import { truncateAddress } from '../utils/truncateAddress';

interface Archaeolgist {
  archAddress: string;
  bounty: BigNumber;
  diggingFee: BigNumber;
  storageFee: BigNumber;
  hashedShard: string;
}

function Home() {
  const { sarcophagi, updateSarcophagi } = useSarcophagi();
  const { uploadArweaveFile, updateStatus, sendStatus, downloadArweaveFile } = useArweaveService();

  const [sarcophagusName, setSarcophagusName] = useState('test');
  const [currentArweaveTxId, setCurrentArweaveTxId] = useState('');
  const [currentSarcoId, setCurrentSarcoId] = useState('');
  const [currentShards, setCurrentShards] = useState<any>([]);
  const [minimumNumberShards, setMinimumNumberShards] = useState(2); //TODO: minimumNumberShards set to 2 for testing. evaluate for production
  const [archaeologists, setArchaeologist] = useState<Archaeolgist[]>([]);
  const [isDownloadVerified, setIsDownloadVerified] = useState(false);

  const { address: embalmerAddress } = useAccount();

  const unnamedAccounts = [
    '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      updateStatus(currentArweaveTxId);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [currentArweaveTxId]);

  const arweaveArchaeologist = unnamedAccounts[2];

  const canBeTransferred = false;

  const {
    file,
    setFile,
    recipientPublicKey,
    setRecipientPublicKey,
    recipientAddress,
    fileEncryptedRecipient,
    setRandomPublicKey,
    doubleEncryptedFile,
    fileByteArray,
  } = useFileEncryption();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFile(acceptedFiles[0]);
    },
    [setFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const { submit: initialize } = useSubmitTransaction({
    functionName: 'initializeSarcophagus',
    contractInterface: EmbalmerFacet.abi,
  });

  const { submit: finalize } = useSubmitTransaction({
    functionName: 'finalizeSarcophagus',
    contractInterface: EmbalmerFacet.abi,
  });

  function secondEncryptAndGenerateShards() {
    const wallet = ethers.Wallet.createRandom();
    const signingKey = new utils.SigningKey(wallet.privateKey);
    const publicKey = signingKey.publicKey;
    setRandomPublicKey(publicKey);

    const secret = Buffer.from(wallet.privateKey);
    const shards = split(secret, { shares: 3, threshold: minimumNumberShards });
    setCurrentShards(shards);

    setArchaeologist([
      {
        archAddress: unnamedAccounts[0],
        bounty: BigNumber.from('100'),
        diggingFee: BigNumber.from('5'),
        storageFee: BigNumber.from('10'),
        hashedShard: utils.id(shards[0].toString('hex')),
      },
      {
        archAddress: unnamedAccounts[1],
        bounty: BigNumber.from('120'),
        diggingFee: BigNumber.from('6'),
        storageFee: BigNumber.from('13'),
        hashedShard: utils.id(shards[1].toString('hex')),
      },
      {
        archAddress: unnamedAccounts[2],
        bounty: BigNumber.from('130'),
        diggingFee: BigNumber.from('4'),
        storageFee: BigNumber.from('9'),
        hashedShard: utils.id(shards[2].toString('hex')),
      },
    ]);
  }

  async function initializeSarcophagus() {
    const currentTimestamp = Date.now();
    const resurrectionTime = currentTimestamp + 7 * 24 * 60 * 60 * 1000;
    const sarcoId = utils.id(embalmerAddress + currentTimestamp.toString());
    setCurrentSarcoId(sarcoId);
    const args = [
      sarcoId,
      {
        name: sarcophagusName,
        recipient: recipientAddress,
        resurrectionTime: resurrectionTime,
        canBeTransferred: canBeTransferred,
        minShards: minimumNumberShards,
      },
      archaeologists,
      arweaveArchaeologist,
    ];
    await initialize({
      args: args,
      toastText: 'Initialize Sarcophagus',
    });

    const arweareTxId = await uploadArweaveFile(doubleEncryptedFile || Buffer.from(''));
    setCurrentArweaveTxId(arweareTxId);
  }

  async function downloadAndVerify() {
    const privateKey = combine(currentShards).toString();
    const isVerify =
      !!fileByteArray && (await downloadArweaveFile(currentArweaveTxId, privateKey, fileByteArray));
    setIsDownloadVerified(isVerify);
  }

  return (
    <FormControl>
      <Tabs>
        <TabList>
          <Tab>Page 1</Tab>
          <Tab>Page 2</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <VStack
              align="left"
              spacing={4}
            >
              <FormLabel>
                Sarcophagus Name
                <Input
                  id="sarcophagusName"
                  value={sarcophagusName}
                  onChange={e => {
                    setSarcophagusName(e.target.value);
                  }}
                />
              </FormLabel>
              <FormLabel>
                Recipient Public Key
                <Input
                  id="recipientPublicKey"
                  value={recipientPublicKey || ''}
                  onChange={e => {
                    setRecipientPublicKey(e.target.value);
                  }}
                />
              </FormLabel>
              <Box
                border="2px"
                minH={100}
                m="9px"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the files here ...</p>
                ) : (
                  <p>Drag and drop some files here, or click to select files</p>
                )}
                {file?.name}
              </Box>
              <Textarea value={fileEncryptedRecipient?.toString()} />
              <FormLabel>
                Minimum Number of Shards (m)
                <Input
                  id="minimumNumberShards"
                  value={minimumNumberShards}
                  onChange={e => {
                    setMinimumNumberShards(Number(e.target.value));
                  }}
                />
              </FormLabel>
              <Text>Number of Archeologist (n): {archaeologists.length}</Text>
              <Button
                variant="solid"
                bg="grey"
                onClick={() => {
                  secondEncryptAndGenerateShards();
                }}
              >
                Generate Shards
              </Button>
              <FormLabel>
                Second Encrypted File
                <Textarea value={doubleEncryptedFile?.toString()} />
              </FormLabel>
              <Button
                variant="solid"
                bg="grey"
                onClick={() => initializeSarcophagus()}
              >
                Initialize Sarcophagus
              </Button>
              <VStack
                align="left"
                border="2px"
              >
                <Box>Sarco Id: {currentSarcoId}</Box>
                <Box>Arweave Tx Id: {currentArweaveTxId}</Box>
                <Box>
                  Status:{' '}
                  {sendStatus.status === 'Pending'
                    ? 'Waiting for Arweave TX to confirm'
                    : sendStatus.status === 'Success'
                    ? 'Arweave TX upload successful'
                    : sendStatus.status}
                </Box>
                <Box>Confimations: {sendStatus.confirmations}</Box>
                <Box>
                  <Button
                    variant="solid"
                    bg="grey"
                    onClick={() => downloadAndVerify()}
                  >
                    Download File and Verify
                  </Button>
                  <Text>Status: {isDownloadVerified ? 'Verify' : 'Not Verify'}</Text>
                </Box>
              </VStack>
              <Button
                variant="solid"
                bg="grey"
                onClick={() => updateSarcophagi()}
              >
                Update Sarchophagi
              </Button>
              {sarcophagi.map(s => (
                <Box key={s.sarcoId}>
                  <HStack>
                    <Box>{truncateAddress(s.sarcoId)}</Box>
                    <Box>{s.name}</Box>
                    <Box>{s.state}</Box>
                  </HStack>
                </Box>
              ))}
            </VStack>

            <Button
              variant="solid"
              bg="grey"
              onClick={() => initializeSarcophagus()}
            >
              Submit
            </Button>
          </TabPanel>
          <TabPanel></TabPanel>
        </TabPanels>
      </Tabs>
    </FormControl>
  );
}

export default Home;
