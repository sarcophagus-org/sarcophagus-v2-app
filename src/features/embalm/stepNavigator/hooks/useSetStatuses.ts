import { useGetBalance } from 'features/embalm/stepContent/hooks/useGetBalance';
import { maxTotalArchaeologists, minimumResurrection } from 'lib/constants';
import { useEffect } from 'react';
import {
  updateStepStatus,
  RecipientState,
  RecipientSetByOption,
  GeneratePDFState,
  resetEmbalmState,
} from 'store/embalm/actions';
import { Step, StepStatus } from 'store/embalm/reducer';
import { useDispatch, useSelector } from 'store/index';
import { useUploadPrice } from './useUploadPrice';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';

export function validateRecipient(recipient: RecipientState) {
  try {
    if (
      recipient.setByOption === RecipientSetByOption.GENERATE &&
      recipient.generatePDFState !== GeneratePDFState.DOWNLOADED
    ) {
      return false;
    }
    ethers.utils.computePublicKey(recipient.publicKey);
  } catch (error) {
    return false;
  }
  return true;
}

export function validateTotalArchaeologists(total: string): boolean {
  const totalAsNumber = parseInt(total);
  return totalAsNumber <= maxTotalArchaeologists && totalAsNumber > 0 && !isNaN(totalAsNumber);
}

export function validateRequiredArchaeologists(required: string, total: string): boolean {
  const totalAsNumber = parseInt(total);
  const requiredAsNumber = parseInt(required);
  return requiredAsNumber <= totalAsNumber && requiredAsNumber > 0 && !isNaN(requiredAsNumber);
}

/**
 * A hook that sets the statuses of the steps when their form elements are modified
 */
export function useSetStatuses() {
  const dispatch = useDispatch();

  const {
    diggingFees,
    file,
    name,
    outerPrivateKey,
    outerPublicKey,
    recipientState,
    requiredArchaeologists,
    resurrection,
    stepStatuses,
    totalArchaeologists,
  } = useSelector(x => x.embalmState);
  const { isConnected: isBundlrConnected } = useSelector(x => x.bundlrState);
  const { uploadPrice } = useUploadPrice();
  const { balance } = useGetBalance();
  const { isConnected: isWalletConnected } = useAccount();

  // Need to declare this here to prevent infinite effect loop
  const nameSarcophagusStatus = stepStatuses[Step.NameSarcophagus];
  const fundBundlrStatus = stepStatuses[Step.FundBundlr];
  const diggingFeesStatus = stepStatuses[Step.SetDiggingFees];
  const totalRequiredArchaeologistsStatus = stepStatuses[Step.TotalRequiredArchaeologists];

  function nameSarcophagusEffect() {
    // Change status to started if any input element has been completed
    const validName = name.trim().length > 0;
    const validResurrection = resurrection - minimumResurrection > Date.now();

    if (validName && validResurrection) {
      dispatch(updateStepStatus(Step.NameSarcophagus, StepStatus.Complete));
    } else {
      dispatch(updateStepStatus(Step.NameSarcophagus, StepStatus.Started));
    }
  }

  function uploadPayloadEffect() {
    if (!!file) {
      dispatch(updateStepStatus(Step.UploadPayload, StepStatus.Complete));
    }
  }

  function fundBundlrEffect() {
    if (isBundlrConnected && parseFloat(balance) > parseFloat(uploadPrice)) {
      dispatch(updateStepStatus(Step.FundBundlr, StepStatus.Complete));
    } else {
      if (fundBundlrStatus !== StepStatus.NotStarted) {
        dispatch(updateStepStatus(Step.FundBundlr, StepStatus.Started));
      }
    }
  }

  function createEncryptionKeypairEffect() {
    if (!!outerPrivateKey && !!outerPublicKey) {
      dispatch(updateStepStatus(Step.CreateEncryptionKeypair, StepStatus.Complete));
    }
  }

  function setRecipientEffect() {
    dispatch(
      updateStepStatus(
        Step.SetRecipient,
        validateRecipient(recipientState) ? StepStatus.Complete : StepStatus.NotStarted
      )
    );
  }

  function diggingFeesEffect() {
    if (parseInt(diggingFees) > 0) {
      dispatch(updateStepStatus(Step.SetDiggingFees, StepStatus.Complete));
    } else {
      if (diggingFeesStatus !== StepStatus.NotStarted) {
        dispatch(updateStepStatus(Step.SetDiggingFees, StepStatus.Started));
      }
    }
  }

  function totalRequiredArchaeologistsEffect() {
    if (
      validateRequiredArchaeologists(requiredArchaeologists, totalArchaeologists) &&
      validateTotalArchaeologists(totalArchaeologists)
    ) {
      dispatch(updateStepStatus(Step.TotalRequiredArchaeologists, StepStatus.Complete));
    } else {
      if (totalRequiredArchaeologistsStatus !== StepStatus.NotStarted) {
        dispatch(updateStepStatus(Step.TotalRequiredArchaeologists, StepStatus.Started));
      }
    }
  }

  function walletDisconnectedEffect() {
    if (!isWalletConnected) {
      dispatch(resetEmbalmState());
    }
  }

  useEffect(nameSarcophagusEffect, [dispatch, name, nameSarcophagusStatus, resurrection]);
  useEffect(uploadPayloadEffect, [dispatch, file]);
  useEffect(fundBundlrEffect, [
    balance,
    dispatch,
    file,
    fundBundlrStatus,
    isBundlrConnected,
    uploadPrice,
  ]);
  useEffect(createEncryptionKeypairEffect, [dispatch, outerPrivateKey, outerPublicKey]);
  useEffect(setRecipientEffect, [dispatch, recipientState]);
  useEffect(diggingFeesEffect, [diggingFees, diggingFeesStatus, dispatch]);
  useEffect(totalRequiredArchaeologistsEffect, [
    dispatch,
    requiredArchaeologists,
    totalArchaeologists,
    totalRequiredArchaeologistsStatus,
  ]);
  useEffect(walletDisconnectedEffect, [dispatch, isWalletConnected]);
}
