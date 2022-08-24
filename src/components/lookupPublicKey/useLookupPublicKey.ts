import { ethers, UnsignedTransaction } from 'ethers';
import { TransactionResponse } from '@ethersproject/providers';
import { useState } from 'react';
import axios from 'axios';
import { useProvider, useNetwork } from 'wagmi';

export enum LookupPublicKeyStatus {
  SUCCESS,
  ERROR,
  NO_TRANSACTIONS,
  LOADING,
  INVALID_ADDRESS,
  WRONG_NETWORK,
  NOT_CONNECTED,
}

const etherscanEndpoint = 'https://api.etherscan.io/api';
const etherscanApikey = process.env.REACT_APP_ETHERSCAN_APIKEY;
const getParameters =
  'module=account&action=txlist&startblock=0&endblock=99999999&page=1&offset=1000&sort=asc';

export function useLookupPublicKey() {
  const [lookupStatus, setLookupStatus] = useState<LookupPublicKeyStatus | null>(null);
  const provider = useProvider();
  const { chain } = useNetwork();

  async function recoverPublicKeyFromTransaction(transactionIn: TransactionResponse) {
    const transactionOut: UnsignedTransaction = {
      type: transactionIn.type,
      nonce: transactionIn.nonce,
      gasLimit: transactionIn.gasLimit,
      to: transactionIn.to,
      value: transactionIn.value,
      data: transactionIn.data,

      ...(transactionIn.chainId && { chainId: transactionIn.chainId }),

      ...((transactionIn.type === 0 || transactionIn.type === 1 || !transactionIn.type) && {
        gasPrice: transactionIn.gasPrice,
      }),

      ...((transactionIn.type === 1 || transactionIn.type === 2) && {
        accessList: transactionIn.accessList,
      }),

      ...(transactionIn.type === 2 && {
        maxFeePerGas: transactionIn.maxFeePerGas,
        maxPriorityFeePerGas: transactionIn.maxPriorityFeePerGas,
      }),
    };

    const resolvedTx = await ethers.utils.resolveProperties(transactionOut);
    const rawTx = ethers.utils.serializeTransaction(resolvedTx);
    const msgHash = ethers.utils.keccak256(rawTx);

    const signature = ethers.utils.splitSignature({
      r: transactionIn.r || '',
      s: transactionIn.s || '',
      v: transactionIn.v || 0,
    });

    const publicKey = ethers.utils.recoverPublicKey(msgHash, signature);

    return ethers.utils.computeAddress(publicKey) == transactionIn.from ? publicKey : undefined;
  }

  async function lookupPublicKey(address: string): Promise<string | undefined> {
    setLookupStatus(LookupPublicKeyStatus.LOADING);
    if (!ethers.utils.isAddress(address)) {
      setLookupStatus(LookupPublicKeyStatus.INVALID_ADDRESS);
      return;
    }

    if (chain) {
      if (chain.id !== 1) {
        setLookupStatus(LookupPublicKeyStatus.WRONG_NETWORK);
        return;
      }
    } else {
      setLookupStatus(LookupPublicKeyStatus.NOT_CONNECTED);
      return;
    }

    const transactionCount = await provider.getTransactionCount(address);
    if (transactionCount === 0) {
      setLookupStatus(LookupPublicKeyStatus.NO_TRANSACTIONS);
      return;
    }

    const response = await axios.get(
      `${etherscanEndpoint}?${getParameters}&address=${address}&apikey=${etherscanApikey}`
    );
    const status = response.data.status;
    if (status !== '1') {
      setLookupStatus(LookupPublicKeyStatus.ERROR);
      return;
    }

    for (let index = 0; index < response.data.result.length; index++) {
      const transaction = await provider.getTransaction(response.data.result[index].hash);

      //we can only resolve a public key when the 'from' transaction matches the given address
      if (transaction.from.toLowerCase() === address.toLowerCase()) {
        const publicKey = await recoverPublicKeyFromTransaction(transaction);
        if (publicKey) {
          setLookupStatus(LookupPublicKeyStatus.SUCCESS);
          return publicKey;
        }
      }
    }

    setLookupStatus(LookupPublicKeyStatus.NO_TRANSACTIONS);
    return;
  }

  return { lookupStatus, lookupPublicKey };
}
