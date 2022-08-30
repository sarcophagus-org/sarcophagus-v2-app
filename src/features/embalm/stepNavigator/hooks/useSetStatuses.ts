import { useEffect } from 'react';
import { updateStepStatus } from 'store/embalm/actions';
import { Step, StepStatus } from 'store/embalm/reducer';
import { useDispatch, useSelector } from 'store/index';

/**
 * A hook that sets the statuses of the steps when their form elements are modified
 */
export function useSetStatuses() {
  const dispatch = useDispatch();
  const { name, payloadPath, stepStatuses } = useSelector(x => x.embalmState);

  function nameSarcophagusEffect() {
    // Change status to started if any input element has been completed
    const nameLength = name.trim().length;

    if (nameLength > 0) {
      dispatch(updateStepStatus(Step.NameSarcophagus, StepStatus.Complete));
    }

    // If the user has interacted with this step and deletes the name, the step will be set to
    // Started status
    if (stepStatuses[Step.NameSarcophagus] !== StepStatus.NotStarted && nameLength === 0) {
      dispatch(updateStepStatus(Step.NameSarcophagus, StepStatus.Started));
    }
  }

  function uploadPayloadEffect() {
    if (!!payloadPath) {
      dispatch(updateStepStatus(Step.UploadPayload, StepStatus.Complete));
    }
  }

  // TODO: Build effects for each other step

  useEffect(nameSarcophagusEffect, [dispatch, name, stepStatuses]);
  useEffect(uploadPayloadEffect, [dispatch, payloadPath]);
}
