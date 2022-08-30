import { bytesToSize } from 'lib/utils/helpers';
import { Step } from 'store/embalm/reducer';
import { useSelector } from 'store/index';
import { Requirements } from './components/Requirements';
import RequirementVariantA from './components/RequirementVariantA';
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
  const { name, payloadSize } = useSelector(x => x.embalmState);

  // Side effects for when the form changes, like updating the step status when a form value changes
  useSetStatuses();

  return (
    <StepsContainer>
      <StepElement
        step={Step.NameSarcophagus}
        title="Name your sarcophagus"
      >
        <Requirements>
          <RequirementVariantA
            title="Name"
            value={name}
          />
        </Requirements>
      </StepElement>

      <StepElement
        step={Step.UploadPayload}
        title="Upload Payload"
      >
        <Requirements>
          <RequirementVariantA
            title="Payload"
            value={payloadSize !== 0 ? bytesToSize(payloadSize) : ''}
          />
        </Requirements>
      </StepElement>

      <StepElement
        step={Step.CreateRecipientKeypair}
        title="Create Recipient Keypair"
      >
        <Requirements>
          <RequirementVariantA
            title="WIP"
            value=""
          />
        </Requirements>
      </StepElement>

      <StepElement
        step={Step.SetResurrection}
        title="Set Resurrections"
      >
        <Requirements>
          <RequirementVariantA
            title="WIP"
            value=""
          />
        </Requirements>
      </StepElement>

      <StepElement
        step={Step.SelectArchaeologists}
        title="Select Archaeologists"
      >
        <Requirements>
          <RequirementVariantA
            title="WIP"
            value=""
          />
        </Requirements>
      </StepElement>

      <StepElement
        step={Step.InitializeSarophagus}
        title="Initialize Sarcophagus"
      >
        <Requirements>
          <RequirementVariantA
            title="WIP"
            value=""
          />
        </Requirements>
      </StepElement>

      <StepElement
        step={Step.FinalizeSarcophagus}
        title="Finalize Sarcophagus"
      >
        <Requirements>
          <RequirementVariantA
            title="WIP"
            value=""
          />
        </Requirements>
      </StepElement>
    </StepsContainer>
  );
}
