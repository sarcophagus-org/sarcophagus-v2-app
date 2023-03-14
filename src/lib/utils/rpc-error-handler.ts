import { ethers } from 'ethers';

// TODO: Makes sense to abstract this file (and similar in service repo) out to
// the contracts package, or the upcoming SDK. (This repo's file is what should be exported)
const alreadyUnwrapped = (e: string) => e.includes('ArchaeologistAlreadyUnwrapped');
const notEnoughFreeBond = (e: string) => e.includes('NotEnoughFreeBond');
const notEnoughReward = (e: string) => e.includes('NotEnoughReward');
const insufficientAllowance = (e: string) => e.includes('insufficient allowance');
const profileShouldExistOrNot = (e: string) => e.includes('ArchaeologistProfileExistsShouldBe');
const lowSarcoBalance = (e: string) => e.includes('transfer amount exceeds balance');
const badlyFormattedHash = (e: string) => e.includes('invalid arrayify value');
const sarcoAlreadyExists = (e: string) => e.includes('SarcophagusAlreadyExists');
const duplicatePublicKey = (e: string) => e.includes('DuplicatePublicKey');
const sarcoDoesNotExist = (e: string) => e.includes('SarcophagusDoesNotExist');
const sarcoNotCleanable = (e: string) => e.includes('SarcophagusNotCleanable');
const sarcoIsActuallyUnwrappable = (e: string) => e.includes('SarcophagusIsUnwrappable');
const notEnoughProof = (e: string) => e.includes('AccuseNotEnoughProof');
const incorrectProof = (e: string) => e.includes('AccuseIncorrectProof');
const sarcophagusParametersExpired = (e: string) => e.includes('SarcophagusParametersExpired');
const invalidSignature = (e: string) => e.includes('InvalidSignature');

/**
 * Parses the text in RPC errors' `.reason` field and returns a more readable error message
 * */
export function handleRpcError(
  e: any,
  opts: { skipConsoleLog?: boolean; callback?: Function } = {}
): string {
  const { reason, errorArgs, errorName } = e;
  const { skipConsoleLog, callback } = opts;

  const errorString: string = reason || errorName || '';

  const handleErrorMsg = (errorMsg: string) => {
    if (!skipConsoleLog) console.log(errorMsg);
    if (callback) callback(errorMsg);
  };

  if (alreadyUnwrapped(errorString)) {
    const errorMsg = '\nAlready unwrapped this Sarcophagus`';
    handleErrorMsg(errorMsg);
    return errorMsg;
  }

  if (profileShouldExistOrNot(errorString) && errorArgs.includes(true)) {
    // In the archaeologist service, this error is handled in `getOnchainProfile`, which
    // should be called first before calling any contract functions that need a profile to exist.
    // Only methods that fail to do this will end up here.
    const errorMsg = '\nProfile not registered';
    handleErrorMsg(errorMsg);
    return errorMsg;
  }

  if (profileShouldExistOrNot(errorString) && errorArgs.includes(false)) {
    const errorMsg = '\nProfile already exists';
    handleErrorMsg(errorMsg);
    return errorMsg;
  }

  if (notEnoughFreeBond(errorString)) {
    const available = errorArgs[0];
    const errorMsg = `\nNot enough free bond. Available: ${ethers.utils.formatEther(
      available
    )} SARCO`;
    handleErrorMsg(errorMsg);
    return errorMsg;
  }

  if (notEnoughReward(errorString)) {
    const available = errorArgs[0];
    const errorMsg = `\nNot enough reward. Available: ${ethers.utils.formatEther(available)} SARCO`;
    handleErrorMsg(errorMsg);
    return errorMsg;
  }

  if (sarcophagusParametersExpired(errorString)) {
    const errorMsg = '\nThe archaeologist signatures have expired';
    handleErrorMsg(errorMsg);
    return errorMsg;
  }

  if (invalidSignature(errorString)) {
    const errorMsg = '\nOne or more archaeologist signatures are invalid';
    handleErrorMsg(errorMsg);
    return errorMsg;
  }

  if (insufficientAllowance(errorString)) {
    const errorMsg =
      '\nInsufficient allowance: You will need to approve Sarcophagus contracts to spend SARCO on your behalf';
    handleErrorMsg(errorMsg);
    return errorMsg;
  }

  if (duplicatePublicKey(errorString)) {
    const errorMsg = '\nOne or more of the encryption public keys provided have already been used';
    handleErrorMsg(errorMsg);
    return errorMsg;
  }

  if (lowSarcoBalance(errorString)) {
    const errorMsg = '\nInsufficient balance\nAdd some SARCO to your account to continue';
    handleErrorMsg(errorMsg);
    return errorMsg;
  }

  if (sarcoAlreadyExists(errorString)) {
    const errorMsg = '\nA sarcophagus already exists with the provided ID';
    handleErrorMsg(errorMsg);
    return errorMsg;
  }

  if (sarcoDoesNotExist(errorString)) {
    const errorMsg = '\nNo Sarcophagus found matching provided ID';
    handleErrorMsg(errorMsg);
    return errorMsg;
  }

  if (badlyFormattedHash(errorString)) {
    const errorMsg =
      '\nInvalid data format. Please check to make sure your input is a valid keccak256 hash.';
    handleErrorMsg(errorMsg);
    return errorMsg;
  }

  if (sarcoNotCleanable(errorString)) {
    const errorMsg = '\nThis Sarcophagus cannot be cleaned at this time';
    handleErrorMsg(errorMsg);
    return errorMsg;
  }

  if (sarcoIsActuallyUnwrappable(errorString)) {
    const errorMsg =
      '\nThis Sarcophagus is ready to be unwrapped, so archaeologists cannot be accused of leaking';
    handleErrorMsg(errorMsg);
    return errorMsg;
  }

  if (notEnoughProof(errorString)) {
    const errorMsg =
      '\nYou have not provided enough unencrypted shard hashes to fully raise an accusal';
    handleErrorMsg(errorMsg);
    return errorMsg;
  }

  if (incorrectProof(errorString)) {
    const errorMsg = '\nOne or more of the proofs provided is incorrect';
    handleErrorMsg(errorMsg);
    return errorMsg;
  }

  const errorMsg = `\n${e}`;
  handleErrorMsg(errorMsg);
  return errorMsg;
}
