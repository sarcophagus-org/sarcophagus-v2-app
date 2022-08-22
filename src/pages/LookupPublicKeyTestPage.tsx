import { VStack, Heading, Input, FormLabel, Button, Text } from '@chakra-ui/react';
import { useState } from 'react';
import axios from 'axios';
import { ethers, UnsignedTransaction } from 'ethers';
import { TransactionResponse } from '@ethersproject/providers';
import { useProvider } from 'wagmi';

export function LookupPublicKeyTestPage() {
  const etherscanEndpoint = 'https://api.etherscan.io/api';
  const etherscanApikey = 'KJZI2B4F3RXBWN6YJMACXARJ5YBEK9WMJV';
  const getParameters =
    'module=account&action=txlist&startblock=0&endblock=99999999&page=1&offset=1000&sort=asc';
  const provider = useProvider();

  enum RetrievalStatus {
    SUCCESS,
    ERROR,
    NOTRANSACTIONS,
    LOADING,
    PENDING,
  }

  const getRetrievalStatusMessage = (retrievalStatus: RetrievalStatus): string => {
    switch (retrievalStatus) {
      case RetrievalStatus.SUCCESS:
        return 'Successfully retrieved public key';
      case RetrievalStatus.ERROR:
        return 'Error retrieving public key';
      case RetrievalStatus.NOTRANSACTIONS:
        return 'No transactions available';
      case RetrievalStatus.LOADING:
        return 'Loading...';
      case RetrievalStatus.PENDING:
      default:
        return '';
    }
  };

  const [address, setAddress] = useState('');
  const [retrievalstatus, setRetrievalStatus] = useState<RetrievalStatus>(RetrievalStatus.PENDING);
  const [publicKey, setPublicKey] = useState('');

  async function recoverPublicKeyFromTransaction(transaction: TransactionResponse) {
    const txData1: UnsignedTransaction = {};

    txData1.type = transaction.type;
    txData1.nonce = transaction.nonce;
    txData1.gasLimit = transaction.gasLimit;
    txData1.to = transaction.to;
    txData1.value = transaction.value;
    txData1.data = transaction.data;
    if (transaction.chainId) {
      txData1.chainId = transaction.chainId;
    }

    if (transaction.type === 0 || !transaction.type) {
      txData1.gasPrice = transaction.gasPrice;
    } else if (transaction.type === 1) {
      txData1.gasPrice = transaction.gasPrice;
      txData1.accessList = transaction.accessList;
    } else if (transaction.type === 2) {
      txData1.accessList = transaction.accessList;
      txData1.maxPriorityFeePerGas = transaction.maxPriorityFeePerGas;
      txData1.maxFeePerGas = transaction.maxFeePerGas;
    } else {
      throw new Error(`Unsupported transaction type: ${transaction.type}`);
    }

    const resolvedTx = await ethers.utils.resolveProperties(txData1);
    const rawTx = ethers.utils.serializeTransaction(resolvedTx);
    const msgHash = ethers.utils.keccak256(rawTx);

    const signature = ethers.utils.splitSignature({
      r: transaction.r || '',
      s: transaction.s || '',
      v: transaction.v || 0,
    });

    const publicKeyxx = ethers.utils.recoverPublicKey(msgHash, signature);

    console.log(transaction, ethers.utils.computeAddress(publicKeyxx));

    if (ethers.utils.computeAddress(publicKeyxx) === transaction.from) return publicKeyxx;
    else {
      console.error('wrong');
      return "Couldn't retrieve public key from address";
    }
  }

  async function handleOnClick(): Promise<void> {
    setPublicKey('');
    setRetrievalStatus(RetrievalStatus.LOADING);
    const response = await axios.get(
      `${etherscanEndpoint}?${getParameters}&address=${address}&apikey=${etherscanApikey}`
    );

    const status = response.data.status;
    if (status === '0') {
      setRetrievalStatus(RetrievalStatus.NOTRANSACTIONS);
    } else if (status === '1') {
      console.log('number of transactions retrieved', response.data.result.length);
      response.data.result.map(async (tranaction: any) => {
        const transaction = await provider.getTransaction(tranaction.hash);

        if (transaction.from.toLowerCase() === address.toLowerCase()) {
          console.log('run');
          const publicKeytemp = await recoverPublicKeyFromTransaction(transaction);
          setPublicKey(publicKeytemp);
        }
      });
      setRetrievalStatus(RetrievalStatus.SUCCESS);
    } else {
      setRetrievalStatus(RetrievalStatus.ERROR);
    }
  }

  return (
    <VStack align="left">
      <Heading>Lookup Public Key</Heading>
      <FormLabel>Etherum Address</FormLabel>
      <Input
        placeholder="0x0..."
        onChange={e => setAddress(e.currentTarget.value)}
        value={address}
      />
      <Button
        background="gray"
        width={20}
        onClick={handleOnClick}
      >
        Submit
      </Button>
      <Text>Status:{getRetrievalStatusMessage(retrievalstatus)}</Text>
      <Text>Public Key:{publicKey}</Text>
    </VStack>
  );
}
