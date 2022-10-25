import { ethers } from 'ethers';

const notEnoughReward = (e: string) => e.includes('NotEnoughReward');
const insufficientAllowance = (e: string) => e.includes('insufficient allowance');
const lowSarcoBalance = (e: string) => e.includes('transfer amount exceeds balance');
const sarcoDoesNotExist = (e: string) => e.includes('SarcophagusDoesNotExist');
const sarcoNotCleanable = (e: string) => e.includes('SarcophagusNotCleanable');
const sarcoIsActuallyUnwrappable = (e: string) => e.includes('SarcophagusIsUnwrappable');
const notEnoughProof = (e: string) => e.includes('AccuseNotEnoughProof');
const incorrectProof = (e: string) => e.includes('AccuseIncorrectProof');
const invalidSignature = (e: string) => e.includes('InvalidSignature');

/**
 * Parses the text in RPC errors' `.reason` field and returns more readable error messages
 * */
export function handleRpcError(e: string) {
    if (invalidSignature(e)) {
        return 'One or more archaeologists signatures was rejected by the contract';
    }

    if (notEnoughReward(e)) {
        const a = e.indexOf('(') + 1;
        const b = e.indexOf(',');

        const available = e.substring(a, b);
        return `Not enough reward. Available: ${ethers.utils.formatEther(available)} SARCO`;
    }

    if (insufficientAllowance(e)) {
        return 'Insufficient allowance';
    }

    if (lowSarcoBalance(e)) {
        return 'Insufficient balance. Add some SARCO to your account to continue';
    }

    if (sarcoDoesNotExist(e)) {
        return 'No Sarcophagus found matching provided ID';
    }

    if (sarcoNotCleanable(e)) {
        return 'This Sarcophagus cannot be cleaned at this time';
    }

    if (sarcoIsActuallyUnwrappable(e)) {
        return 'This Sarcophagus is ready to be unwrapped, so archaeologists cannot be accused of leaking';
    }

    if (notEnoughProof(e)) {
        return 'You have not provided enough unencrypted shard hashes to fully raise an accusal';
    }

    if (incorrectProof(e)) {
        return 'One or more of the proofs provided is incorrect';
    }


    return e;
}
