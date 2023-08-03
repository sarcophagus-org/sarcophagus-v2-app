import { ethers } from 'ethers';
import { Step } from 'store/embalm/reducer';
import { useSelector } from 'store/index';
import { StepElement } from './components/StepElement';
import { StepsContainer } from './components/StepsContainer';
import { useSetStatuses } from './hooks/useSetStatuses';

/**
 * The embalm step navigator.
 * Uses the state in the store to keep track of the current step.
 * Does not use routes to track the current step.
 */
export function StepNavigator() {
  const { isFunding, balanceOffset } = useSelector(x => x.bundlrState);

  useSetStatuses();

  return (
    <StepsContainer>
      <StepElement
        step={Step.NameSarcophagus}
        title="Name your sarcophagus"
      />

      <StepElement
        step={Step.UploadPayload}
        title="Upload Payload"
      />

      <StepElement
        step={Step.FundBundlr}
        title="Fund Arweave Bundlr"
        isLoading={isFunding || !balanceOffset.eq(ethers.constants.Zero)}
      />

      <StepElement
        step={Step.SetRecipient}
        title="Set Recipient"
      />

      <StepElement
        step={Step.SelectArchaeologists}
        title="Select Archaeologists"
      />

      <StepElement
        step={Step.RequiredArchaeologists}
        title="Required Archaeologists"
      />

      <StepElement
        step={Step.CreateSarcophagus}
        title="Create"
      />
    </StepsContainer>
  );
}
