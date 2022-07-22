import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  FormControl,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Input,
  FormLabel,
  VStack,
  Button,
  Box,
  Textarea,
  Text,
} from '@chakra-ui/react';
import { ethers, utils, BigNumber } from 'ethers';
import { useAccount } from 'wagmi';
import { useSubmitTransaction } from '../lib/useSubmitTransactions';
import { EmbalmerFacet__factory } from '../assets/typechain';
import useFileEncryption from '../contexts/useFileEncryption';
import { split, combine } from 'shamirs-secret-sharing-ts';

interface Archaeolgist {
  archAddress: string;
  bounty: BigNumber;
  diggingFee: BigNumber;
  storageFee: BigNumber;
  hashedShard: string;
}

function Home() {
  const [sarcophagusName, setSarcophagusName] = useState('');
  const [recipientAddress, setRecipientAddress] = useState<string | null>(null);
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

  const arweaveArchaeologist = unnamedAccounts[2];

  const canBeTransferred = false;

  const {
    file,
    setFile,
    recipientPublicKey,
    setRecipientPublicKey,
    fileEncryptedRecipient,
    setRandomPublicKey,
    doubleEncryptedFile,
  } = useFileEncryption();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    const fr = new FileReader();
    fr.readAsText(acceptedFiles[0]);
    fr.onload = () => console.log(fr.result);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const { submit } = useSubmitTransaction({
    functionName: 'initializeSarcophagus',
    contractInterface: EmbalmerFacet__factory.abi,
  });

  function secondEncryptAndGenerateShards() {
    const wallet = ethers.Wallet.createRandom();
    const signingKey = new utils.SigningKey(wallet.privateKey);
    const publicKey = signingKey.publicKey;
    console.log(publicKey);
    setRandomPublicKey(publicKey);

    const secret = Buffer.from(wallet.privateKey);
    const shards = split(secret, { shares: 3, threshold: minimumNumberShards });

    console.log('shards', shards);

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

  function initializeSarcophagus() {
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

    console.log('initializeSarcophagus args', args);
    submit({
      args: args,
      toastText: 'Initialize Sarcophagus',
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
                Recipient
                <Input
                  id="recipientAddress"
                  value={recipientAddress || ''}
                  onChange={e => {
                    setRecipientAddress(e.target.value);
                  }}
                />
                <Input
                  id="recipientPublicKey"
                  value={recipientPublicKey || ''}
                  onChange={e => {
                    setRecipientPublicKey(e.target.value);
                  }}
                />
              </FormLabel>

              <Button
                onClick={() => {
                  setRecipientAddress('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
                  setRecipientPublicKey(
                    '0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5'
                  );
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
              <Box>
                Resurection TimeStamp: {resurrectionTime} {new Date(resurrectionTime).toString()}
              </Box>
            </VStack>

            <Button onClick={() => initializeSarcophagus()}>Submit</Button>
          </TabPanel>
          <TabPanel>Page 2</TabPanel>
        </TabPanels>
      </Tabs>
    </FormControl>
  );
}

export default Home;
