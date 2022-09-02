import { minimumResurrection } from 'lib/constants';
import { formatResurrection } from 'lib/utils/helpers';
import prettyBytes from 'pretty-bytes';
import { Step } from 'store/embalm/reducer';
import { useSelector } from 'store/index';
import { useGetBalance } from '../stepContent/hooks/useGetBalance';
import { Requirements } from './components/Requirements';
import RequirementVariantA from './components/RequirementVariantA';
import RequirementVariantB from './components/RequirementVariantB';
import { StepElement } from './components/StepElement';
import { StepsContainer } from './components/StepsContainer';
import { useUploadPrice } from './hooks/useUploadPrice';
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
  const { name, file, publicKey, outerPublicKey, outerPrivateKey, resurrection } = useSelector(
    x => x.embalmState
  );
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
        step={Step.SetRecipientPublicKey}
        title="Set Recipient Public Key"
      >
        <Requirements>
          <RequirementVariantB
            title="Public Key"
            valid={validatePublicKey(publicKey)}
          />
        </Requirements>
      </StepElement>

      <StepElement
        step={Step.CreateEncryptionKeypair}
        title="Create Encryption Keypair"
      >
        <Requirements>
          <RequirementVariantB
            title="Key pair generated"
            valid={!!outerPublicKey && !!outerPrivateKey}
          />
        </Requirements>
      </StepElement>
      <StepElement
        step={Step.Resurrections}
        title="Resurrections"
      >
        <Requirements>
          <RequirementVariantA
            title="First rewrap"
            value={`${formatResurrection(resurrection)} from now`}
            valid={resurrection >= minimumResurrection}
          />
        </Requirements>
      </StepElement>
    </StepsContainer>
  );
}
