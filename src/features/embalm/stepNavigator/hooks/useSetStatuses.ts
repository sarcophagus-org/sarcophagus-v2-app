import { useGetBalance } from 'features/embalm/stepContent/hooks/useGetBalance';
import { maxTotalArchaeologists, minimumResurrection } from 'lib/constants';
import { useEffect } from 'react';
import { updateStepStatus, Recipient } from 'store/embalm/actions';
import { Step, StepStatus } from 'store/embalm/reducer';
import { useDispatch, useSelector } from 'store/index';
import { useUploadPrice } from './useUploadPrice';
import { ethers } from 'ethers';

export function validateRecipient(recipient: Recipient) {
  //TODO: do we want to check options for validity? i.e. by address need to have the address set?
  try {
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
    recipient,
    requiredArchaeologists,
    resurrection,
    stepStatuses,
    totalArchaeologists,
  } = useSelector(x => x.embalmState);
  const isConnected = useSelector(x => x.bundlrState.isConnected);
  const { uploadPrice } = useUploadPrice();
  const { balance } = useGetBalance();

  // Need to declare this here to prevent infinite effect loop
  const nameSarcophagusStatus = stepStatuses[Step.NameSarcophagus];
  const fundBundlrStatus = stepStatuses[Step.FundBundlr];
  const resurrectionsStatus = stepStatuses[Step.Resurrections];
  const diggingFeesStatus = stepStatuses[Step.SetDiggingFees];
  const totalRequiredArchaeologistsStatus = stepStatuses[Step.TotalRequiredArchaeologists];

  function nameSarcophagusEffect() {
    // Change status to started if any input element has been completed
    const nameLength = name.trim().length;

    if (nameLength > 0) {
      dispatch(updateStepStatus(Step.NameSarcophagus, StepStatus.Complete));
    }

    // If the user has interacted with this step and deletes the name, the step will be set to
    // Started status
    if (nameSarcophagusStatus !== StepStatus.NotStarted && nameLength === 0) {
      dispatch(updateStepStatus(Step.NameSarcophagus, StepStatus.Started));
    }
  }

  function uploadPayloadEffect() {
    if (!!file) {
      dispatch(updateStepStatus(Step.UploadPayload, StepStatus.Complete));
    }
  }

  function fundBundlrEffect() {
    if (isConnected && parseFloat(balance) > parseFloat(uploadPrice)) {
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
        validateRecipient(recipient) ? StepStatus.Complete : StepStatus.NotStarted
      )
    );
  }

  function resurrectionsEffect() {
    if (resurrection >= minimumResurrection) {
      dispatch(updateStepStatus(Step.Resurrections, StepStatus.Complete));
    } else {
      if (resurrectionsStatus !== StepStatus.NotStarted) {
        dispatch(updateStepStatus(Step.Resurrections, StepStatus.Started));
      }
    }
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

  useEffect(nameSarcophagusEffect, [dispatch, name, nameSarcophagusStatus]);
  useEffect(uploadPayloadEffect, [dispatch, file]);
  useEffect(fundBundlrEffect, [
    balance,
    dispatch,
    file,
    fundBundlrStatus,
    isConnected,
    uploadPrice,
  ]);
  useEffect(createEncryptionKeypairEffect, [dispatch, outerPrivateKey, outerPublicKey]);
  useEffect(setRecipientEffect, [dispatch, recipient]);
  useEffect(resurrectionsEffect, [
    dispatch,
    outerPrivateKey,
    outerPublicKey,
    resurrection,
    resurrectionsStatus,
  ]);
  useEffect(diggingFeesEffect, [diggingFees, diggingFeesStatus, dispatch]);
  useEffect(totalRequiredArchaeologistsEffect, [
    dispatch,
    requiredArchaeologists,
    totalArchaeologists,
    totalRequiredArchaeologistsStatus,
  ]);
}
