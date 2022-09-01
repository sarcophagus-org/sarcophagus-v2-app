import prettyBytes from 'pretty-bytes';
import { Step } from 'store/embalm/reducer';
import { useSelector } from 'store/index';
import { useGetBalance } from '../stepContent/hooks/useGetBalance';
import { Requirements } from './components/Requirements';
import RequirementVariantA from './components/RequirementVariantA';
import { StepElement } from './components/StepElement';
import { StepsContainer } from './components/StepsContainer';
import { useSetStatuses } from './hooks/useSetStatuses';
import { useUploadPrice } from './hooks/useUploadPrice';

/**
 * The embalm step navigator.
 * Uses the state in the store to keep track of the current step.
 * Does not use routes to track the current step.
 */
export function StepNavigator() {
  const { name, file } = useSelector(x => x.embalmState);
  const { isFunding } = useSelector(x => x.bundlrState);
  const { balance, formattedBalance } = useGetBalance();
  const { uploadPrice } = useUploadPrice();

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
            valid={name.length > 0}
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
            valid={!!file}
          />
        </Requirements>
      </StepElement>

      <StepElement
        step={Step.FundBundlr}
        title="Fund Arweave Bundlr"
        isLoading={isFunding}
      >
        <Requirements>
          <RequirementVariantA
            title="Bundlr balance"
            value={formattedBalance}
            valid={parseFloat(balance) > parseFloat(uploadPrice)}
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
            valid={false}
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
            valid={false}
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
            valid={false}
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
            valid={false}
          />
        </Requirements>
      </StepElement>
    </StepsContainer>
  );
}
