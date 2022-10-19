import { useGetBalance } from 'features/embalm/stepContent/hooks/useGetBalance';
import { maxTotalArchaeologists, minimumResurrection } from 'lib/constants';
import { useEffect } from 'react';
import {
  updateStepStatus,
  RecipientState,
  RecipientSetByOption,
  GeneratePDFState,
} from 'store/embalm/actions';
import { Step, StepStatus } from 'store/embalm/reducer';
import { useDispatch, useSelector } from 'store/index';
import { useUploadPrice } from './useUploadPrice';
import { ethers } from 'ethers';

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

export function validateRequiredArchaeologists(required: number, total: number): boolean {
  return Number.isInteger(required) && required > 0 && required <= total;
}

/**
 * A hook that sets the statuses of the steps when their form elements are modified
 */
export function useSetStatuses() {
  const dispatch = useDispatch();

  const {
    selectedArchaeologists,
    file,
    name,
    outerPrivateKey,
    outerPublicKey,
    recipientState,
    requiredArchaeologists,
    resurrection,
    stepStatuses,
  } = useSelector(x => x.embalmState);
  const isConnected = useSelector(x => x.bundlrState.isConnected);
  const { uploadPrice } = useUploadPrice();
  const { balance } = useGetBalance();

  // Need to declare this here to prevent infinite effect loop
  const nameSarcophagusStatus = stepStatuses[Step.NameSarcophagus];
  const fundBundlrStatus = stepStatuses[Step.FundBundlr];
  const requiredArchaeologistsStatus = stepStatuses[Step.RequiredArchaeologists];
  const selectedArchaeologistsStatus = stepStatuses[Step.SelectArchaeologists];

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
        validateRecipient(recipientState) ? StepStatus.Complete : StepStatus.NotStarted
      )
    );
  }

  function requiredArchaeologistsEffect() {
    if (validateRequiredArchaeologists(requiredArchaeologists, selectedArchaeologists.length)) {
      dispatch(updateStepStatus(Step.RequiredArchaeologists, StepStatus.Complete));
    } else {
      if (requiredArchaeologistsStatus !== StepStatus.NotStarted) {
        dispatch(updateStepStatus(Step.RequiredArchaeologists, StepStatus.Started));
      }
    }
  }

  function selectedArchaeologistsEffect() {
    if (selectedArchaeologists.length > 0 && selectedArchaeologists.length <= maxTotalArchaeologists) {
      dispatch(updateStepStatus(Step.SelectArchaeologists, StepStatus.Complete));
    } else {
      if (selectedArchaeologistsStatus !== StepStatus.NotStarted) {
        dispatch(updateStepStatus(Step.SelectArchaeologists, StepStatus.Started));
      }
    }
  }

  useEffect(nameSarcophagusEffect, [dispatch, name, nameSarcophagusStatus, resurrection]);
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
  useEffect(setRecipientEffect, [dispatch, recipientState]);
  useEffect(selectedArchaeologistsEffect, [dispatch, selectedArchaeologists, selectedArchaeologistsStatus]);
  useEffect(requiredArchaeologistsEffect, [
    dispatch,
    requiredArchaeologists,
    selectedArchaeologists.length,
    requiredArchaeologistsStatus,
  ]);
}
