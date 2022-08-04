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
import { split } from 'shamirs-secret-sharing-ts';
import { useAccount } from 'wagmi';
import useArchaeologistService from '../contexts/useArchaeologistService';
import useSarcophagi from '../contexts/useSarcophagi';
import useFileEncryption from '../hooks/useFileEncryption';
import { useSubmitTransaction } from '../hooks/useSubmitTransactions';
import { EmbalmerFacet__factory } from '../typechain';
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
  const { uploadArweaveFile, updateStatus, sendStatus } = useArchaeologistService();

  const [sarcophagusName, setSarcophagusName] = useState('test');
  const [currentArweaveTxId, setCurrentArweaveTxId] = useState('');
  const [currentSarcoId, setCurrentSarcoId] = useState('');

  const [minimumNumberShards, setMinimumNumberShards] = useState(3);
  const [archaeologists, setArchaeologist] = useState<Archaeolgist[]>([]);

  const { address: embalmerAddress } = useAccount();
  const currentTimestamp = Date.now();
  const resurrectionTime = currentTimestamp + 7 * 24 * 60 * 60 * 1000;
  const maxResurrectionInterval = resurrectionTime;

  const sarcoId = utils.id(embalmerAddress + currentTimestamp.toString());

  const unnamedAccounts = [
    '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
  ];

  useEffect(() => {
    updateStatus();
    const interval = setInterval(() => {
      updateStatus();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

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
  } = useFileEncryption();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    const fr = new FileReader();
    fr.readAsText(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const { submit: initialize } = useSubmitTransaction({
    functionName: 'initializeSarcophagus',
    contractInterface: EmbalmerFacet__factory.abi,
  });

  const { submit: finalize } = useSubmitTransaction({
    functionName: 'finalizeSarcophagus',
    contractInterface: EmbalmerFacet__factory.abi,
  });

  function secondEncryptAndGenerateShards() {
    const wallet = ethers.Wallet.createRandom();
    const signingKey = new utils.SigningKey(wallet.privateKey);
    const publicKey = signingKey.publicKey;
    setRandomPublicKey(publicKey);

    const secret = Buffer.from(wallet.privateKey);
    const shards = split(secret, { shares: 3, threshold: minimumNumberShards });

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
    const args = [
      sarcophagusName,
      archaeologists,
      arweaveArchaeologist,
      recipientAddress,
      resurrectionTime,
      maxResurrectionInterval,
      canBeTransferred,
      minimumNumberShards,
      sarcoId,
    ];
    await initialize({
      args: args,
      toastText: 'Initialize Sarcophagus',
    });
    const arweareTxId = await uploadArweaveFile(sarcoId, doubleEncryptedFile || Buffer.from(''));
    setCurrentArweaveTxId(arweareTxId);
    setCurrentSarcoId(sarcoId);
  }

  function finalizeSarcophagus(sarcodId: string, arweareTxId: string) {
    const args = [
      sarcodId,
      archaeologists
        .filter(arch => arch.archAddress !== arweaveArchaeologist)
        .map(arch => arch.archAddress),
      arweaveArchaeologist,
      arweareTxId,
    ];
    finalize({
      args: args,
      toastText: 'Finalize Sarcophagus',
    });
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
            <VStack align="left">
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
              <Button
                variant="solid"
                bg="grey"
                onClick={() => {
                  const key =
                    '0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5';
                  setRecipientPublicKey(key);
                }}
              >
                Default Recipient
              </Button>
              <Box
                border="2px"
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
              <Box>sarcoId: {sarcoId}</Box>
              <Box>Recipient Address: {recipientAddress}</Box>
              <Box>
                Resurection TimeStamp: {resurrectionTime} {new Date(resurrectionTime).toString()}
              </Box>
              <Button onClick={() => initializeSarcophagus()}>Submit</Button>
              <HStack>
                <Box>Current (sarcoId, arweaveId):</Box>
                <Box>{currentSarcoId}</Box>
                <Box>{currentArweaveTxId}</Box>
                <Box>Status: {sendStatus.status}</Box>
                <Box>Confimations: {sendStatus.confirmations}</Box>
                <Box>
                  <Button onClick={() => finalizeSarcophagus(currentSarcoId, currentArweaveTxId)}>
                    Finalize
                  </Button>
                </Box>
              </HStack>
              <Button onClick={() => updateSarcophagi()}>Update Sarchophagi</Button>
              {sarcophagi.map(s => (
                <Box key={s.sarcoId}>
                  <HStack>
                    <Box>{truncateAddress(s.sarcoId)}</Box>
                    <Box>{s.name}</Box>
                    <Box>{s.state}</Box>
                    <Box>{s.arweaveTxId}</Box>
                    <Box>{s.confirmations}</Box>
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
