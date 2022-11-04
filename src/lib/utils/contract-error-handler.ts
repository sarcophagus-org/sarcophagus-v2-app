import { ethers } from 'ethers';

const errorMessageMapping = new Map<string, string | Function>([
    [
        'NotEnoughReward',
        (e: string) => {
            const a = e.indexOf('(') + 1;
            const b = e.indexOf(',');

            const available = e.substring(a, b);
            return `Not enough reward. Available: ${ethers.utils.formatEther(available)} SARCO`;
        }
    ],
    [
        'insufficient allowance',
        'Insufficient allowance'
    ],
    [
        'transfer amount exceeds balance',
        'Insufficient balance. Add some SARCO to your account to continue'
    ],
    [
        'SarcophagusDoesNotExist',
        'No Sarcophagus found matching provided ID'
    ],
    [
        'SarcophagusNotCleanable',
        'This Sarcophagus cannot be cleaned at this time'
    ],
    [
        'SarcophagusIsUnwrappable',
        'This Sarcophagus is ready to be unwrapped, so archaeologists cannot be accused of leaking'
    ],
    [
        'AccuseNotEnoughProof',
        'You have not provided enough unencrypted shard hashes to fully raise an accusal'
    ],
    [
        'AccuseIncorrectProof',
        'One or more of the proofs provided is incorrect'
    ],
    [
        'InvalidSignature',
        'One or more archaeologists signatures was rejected by the contract'
    ],
]);

/**
 * Parses the text in RPC errors' `.reason` field and returns more readable error messages
 * */
export function formatContractCallException(e: string): string {
    for (let [key, value] of errorMessageMapping) {
        if (e.includes(key)) {
            if (typeof value === 'function') {
                return value(e);
            } else {
                return value;
            }
        }
    }

    return e;
}
