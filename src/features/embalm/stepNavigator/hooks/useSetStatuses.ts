import { useGetBalance } from 'features/embalm/stepContent/hooks/useGetBalance';
import { useEffect } from 'react';
import { updateStepStatus } from 'store/embalm/actions';
import { Step, StepStatus } from 'store/embalm/reducer';
import { useDispatch, useSelector } from 'store/index';
import { useUploadPrice } from './useUploadPrice';

/**
 * A hook that sets the statuses of the steps when their form elements are modified
 */
export function useSetStatuses() {
  const dispatch = useDispatch();
  const { name, file, stepStatuses } = useSelector(x => x.embalmState);
  const isConnected = useSelector(x => x.bundlrState.isConnected);
  const { uploadPrice } = useUploadPrice();
  const { balance } = useGetBalance();

  // Need to declare this here to prevent infinite effect loop
  const nameSarcophagusStatus = stepStatuses[Step.NameSarcophagus];
  const fundBundlrStatus = stepStatuses[Step.FundBundlr];

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

  // TODO: Build effects for each other step

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
}
