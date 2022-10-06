import { Step } from 'store/embalm/reducer';
import { useSelector } from 'store/index';
import { StepElement } from './components/StepElement';
import { StepsContainer } from './components/StepsContainer';
import { useSetStatuses } from './hooks/useSetStatuses';

export enum StepId {
  NameSarcophagus,
  UploadPayload,
}

/**
 * The embalm step navigator.
 * Uses the state in the store to keep track of the current step.
 * Does not use routes to track the current step.
 */
export function StepNavigator() {
  const { isFunding } = useSelector(x => x.bundlrState);

  useSetStatuses();

  return (
    <StepsContainer>
      <StepElement
        step={Step.NameSarcophagus}
        title="Name your sarcophagus"
      ></StepElement>

      <StepElement
        step={Step.UploadPayload}
        title="Upload Payload"
      ></StepElement>

      <StepElement
        step={Step.FundBundlr}
        title="Fund Arweave Bundlr"
        isLoading={isFunding}
      ></StepElement>

      <StepElement
        step={Step.SetRecipient}
        title="Set Recipient"
      ></StepElement>

      <StepElement
        step={Step.CreateEncryptionKeypair}
        title="Create Encryption Keypair"
      ></StepElement>

      <StepElement
        step={Step.SetDiggingFees}
        title="Set Digging Fees"
      ></StepElement>

      <StepElement
        step={Step.TotalRequiredArchaeologists}
        title="Total/Required Archaeologists"
      ></StepElement>

      <StepElement
        step={Step.SelectArchaeologists}
        title="Select Archaeologists"
      ></StepElement>

      <StepElement
        step={Step.CreateSarcophagus}
        title="CreateSarcophagus"
      ></StepElement>
    </StepsContainer>
  );
}
