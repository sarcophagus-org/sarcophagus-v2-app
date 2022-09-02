import { useEffect } from 'react';
import { updateStepStatus } from 'store/embalm/actions';
import { Step, StepStatus } from 'store/embalm/reducer';
import { useDispatch, useSelector } from 'store/index';
import { ethers } from 'ethers';

export function validatePublicKey(key: string) {
  try {
    ethers.utils.computePublicKey(key);
  } catch (error) {
    return false;
  }
  return true;
}

/**
 * A hook that sets the statuses of the steps when their form elements are modified
 */
export function useSetStatuses() {
  const dispatch = useDispatch();
  const { name, file, publicKey, stepStatuses } = useSelector(x => x.embalmState);

  // Need to declare this here to prevent infinite effect loop
  const nameSarcophagusStatus = stepStatuses[Step.NameSarcophagus];

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

  function setPublicKeyEffect() {
    dispatch(
      updateStepStatus(
        Step.SetRecipientPublicKey,
        validatePublicKey(publicKey) ? StepStatus.Complete : StepStatus.NotStarted
      )
    );
  }

  // TODO: Build effects for each other step

  useEffect(nameSarcophagusEffect, [dispatch, name, nameSarcophagusStatus]);
  useEffect(uploadPayloadEffect, [dispatch, file]);
  useEffect(setPublicKeyEffect, [dispatch, publicKey]);
}