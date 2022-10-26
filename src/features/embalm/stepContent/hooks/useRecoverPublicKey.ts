import { ethers, UnsignedTransaction } from 'ethers';
import { TransactionResponse } from '@ethersproject/providers';
import { useState, useCallback } from 'react';
import axios from 'axios';
import { useProvider } from 'wagmi';
import { useDispatch } from 'store/index';
import { setRecipientState, RecipientSetByOption } from 'store/embalm/actions';
import { useNetworkConfig } from '../../../../lib/config';
import { log } from '../../../../lib/utils/logger';

/**
 * returns a public key from a transaction
 *
 * transaction.type can be these values, results in UnsignedTransaction object
 * from EIP-2719 (https://eips.ethereum.org/EIPS/eip-2719)
 * defines legacy transaction
 *   0x00 or not set - rlp([nonce, gasPrice, gasLimit, to, value, data, v, r, s])
 *
 * from EIP-2930 (https://eips.ethereum.org/EIPS/eip-2930)
 *   0x01 - rlp([chainId, nonce, gasPrice, gasLimit, to, value, data, accessList, signatureYParity, signatureR, signatureS])
 *
 * from EIP-1559 (https://eips.ethereum.org/EIPS/eip-1559)
 *   0x02 - rlp([chain_id, nonce, max_priority_fee_per_gas, max_fee_per_gas, gas_limit, destination, amount, data, access_list, signature_y_parity, signature_r, signature_s]).
 */
async function getPublicKeyFromTransactionResponse(transaction: TransactionResponse) {
  function isLegacy(type: number | null | undefined): boolean {
    return type === 0 || !type;
  }

  function isEIP2930(type: number | null | undefined): boolean {
    return type === 1;
  }

  function isEIP1550(type: number | null | undefined): boolean {
    return type === 2;
  }

  const unsignedTransaction: UnsignedTransaction = {
    type: transaction.type,
    nonce: transaction.nonce,
    gasLimit: transaction.gasLimit,
    to: transaction.to,
    value: transaction.value,
    data: transaction.data,

    ...(transaction.chainId && { chainId: transaction.chainId }),

    ...((isLegacy(transaction.type) || isEIP2930(transaction.type)) && {
      gasPrice: transaction.gasPrice
    }),

    ...((isEIP2930(transaction.type) || isEIP1550(transaction.type)) && {
      accessList: transaction.accessList
    }),

    ...(isEIP1550(transaction.type) && {
      maxFeePerGas: transaction.maxFeePerGas,
      maxPriorityFeePerGas: transaction.maxPriorityFeePerGas
    })
  };

  const resolvedTx = await ethers.utils.resolveProperties(unsignedTransaction);
  const rawTx = ethers.utils.serializeTransaction(resolvedTx);
  const msgHash = ethers.utils.keccak256(rawTx);

  const signature = ethers.utils.splitSignature({
    r: transaction.r || '',
    s: transaction.s || '',
    v: transaction.v || 0
  });

  return ethers.utils.recoverPublicKey(msgHash, signature);
}

export enum ErrorStatus {
  SUCCESS = 1,
  INVALID_ADDRESS,
  CANNOT_RECOVER,
  ERROR,
}

const getParameters =
  'module=account&action=txlist&startblock=0&endblock=99999999&page=1&offset=1000&sort=asc';

export function useRecoverPublicKey() {
  const networkConfig = useNetworkConfig();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<ErrorStatus | null>(null);

  const provider = useProvider();

  const recoverPublicKey = useCallback(
    async (address: string) => {
      try {
        setIsLoading(true);
        if (!ethers.utils.isAddress(address.toLowerCase())) {
          setErrorStatus(ErrorStatus.INVALID_ADDRESS);

          return;
        }
        log(`retrieving public key for address ${address}`);
        const response = await axios.get(
          `${networkConfig.explorerUrl}?${getParameters}&address=${address}&apikey=${networkConfig.explorerApiKey}`
        );

        if (response.status !== 200) {
          setErrorStatus(ErrorStatus.ERROR);
          log('recoverPublicKey error:', response.data.message);
          return;
        }

        for (let index = 0; index < response.data.result.length; index++) {
          const transaction = await provider.getTransaction(response.data.result[index].hash);

          //we can only resolve a public key when the 'from' transaction matches the given address
          if (transaction.from && transaction.from.toLowerCase() === address.toLowerCase()) {
            const recoveredPublicKey = await getPublicKeyFromTransactionResponse(transaction);
            if (
              ethers.utils.computeAddress(recoveredPublicKey).toLowerCase() == address.toLowerCase()
            ) {
              dispatch(
                setRecipientState({
                  publicKey: recoveredPublicKey,
                  address: address,
                  setByOption: RecipientSetByOption.ADDRESS
                })
              );

              log('recovered public key', recoveredPublicKey);
              setErrorStatus(ErrorStatus.SUCCESS);

              return;
            }
          }
        }
        setErrorStatus(ErrorStatus.CANNOT_RECOVER);
      } catch (_error) {
        const error = _error as Error;
        log('useRecoverPublicKey error', error);
        setErrorStatus(ErrorStatus.ERROR);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, provider, networkConfig.explorerApiKey, networkConfig.explorerUrl]
  );

  return { recoverPublicKey, isLoading, errorStatus };
}
