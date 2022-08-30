import { useEffect } from 'react';
import { useDispatch, useSelector } from 'store/index';
import { updateStepStatus } from 'store/embalm/actions';
import { Step, StepStatus } from 'store/embalm/reducer';

/**
 * A hook that contains the side effects for when form elements change, like updating a step status
 * when the inputs are filled
 */
export function useFormEffects() {
  const dispatch = useDispatch();
  const { name, recipientPublicKey, payloadPath } = useSelector(x => x.embalmState);

  function nameSarcophagusEffect() {
    // Change status to started if any input element has been completed
    if (name.trim().length > 0 || !!recipientPublicKey) {
      dispatch(updateStepStatus(Step.NameSarcophagus, StepStatus.Started));
    }

    // Change status to complete if both input elements are complete
    if (name.trim().length > 0 && !!recipientPublicKey) {
      dispatch(updateStepStatus(Step.NameSarcophagus, StepStatus.Complete));
    }
  }

  function uploadPayloadEffect() {
    if (!!payloadPath) {
      dispatch(updateStepStatus(Step.UploadPayload, StepStatus.Complete));
    }
  }

  // TODO: Build effects for each other step

  useEffect(nameSarcophagusEffect, [dispatch, name, recipientPublicKey]);
  useEffect(uploadPayloadEffect, [dispatch, payloadPath]);
}
