import prettyBytes from 'pretty-bytes';
import { Step } from 'store/embalm/reducer';
import { useSelector } from 'store/index';
import { Requirements } from './components/Requirements';
import RequirementVariantA from './components/RequirementVariantA';
import RequirementVariantB from './components/RequirementVariantB';
import { StepElement } from './components/StepElement';
import { StepsContainer } from './components/StepsContainer';
import { useSetStatuses, validatePublicKey } from './hooks/useSetStatuses';

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
  const { name, file, publicKey } = useSelector(x => x.embalmState);

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
            value={file ? prettyBytes(file.size) : ''}
          />
        </Requirements>
      </StepElement>

      <StepElement
        step={Step.SetRecipientPublicKey}
        title="Set Recipient Public Key"
      >
        <Requirements>
          <RequirementVariantB
            title="Public Key"
            filled={validatePublicKey(publicKey)}
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
