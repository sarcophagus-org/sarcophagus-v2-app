import { Image } from '@chakra-ui/react';
import { minimumResurrection } from 'lib/constants';
import { formatLargeNumber, formatResurrection } from 'lib/utils/helpers';
import prettyBytes from 'pretty-bytes';
import { Step } from 'store/embalm/reducer';
import { useSelector } from 'store/index';
import { useGetBalance } from '../stepContent/hooks/useGetBalance';
import { Requirements } from './components/Requirements';
import RequirementVariantA from './components/RequirementVariantA';
import RequirementVariantB from './components/RequirementVariantB';
import { StepElement } from './components/StepElement';
import { StepsContainer } from './components/StepsContainer';
import { useSetStatuses, validatePublicKey } from './hooks/useSetStatuses';
import { useUploadPrice } from './hooks/useUploadPrice';

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
  const { name, file, publicKey, outerPublicKey, outerPrivateKey, resurrection, diggingFees } =
    useSelector(x => x.embalmState);
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
            valid={name.length > 0}
          >
            {name}
          </RequirementVariantA>
        </Requirements>
      </StepElement>

      <StepElement
        step={Step.UploadPayload}
        title="Upload Payload"
      >
        <Requirements>
          <RequirementVariantA
            title="Payload"
            valid={!!file}
          >
            {file ? prettyBytes(file.size) : ''}
          </RequirementVariantA>
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
            valid={parseFloat(balance) > parseFloat(uploadPrice)}
          >
            {formattedBalance}
          </RequirementVariantA>
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
            valid={resurrection >= minimumResurrection}
          >
            {formatResurrection(resurrection)}
          </RequirementVariantA>
        </Requirements>
      </StepElement>
      <StepElement
        step={Step.SetDiggingFees}
        title="Set Digging Fees"
      >
        <Requirements>
          <RequirementVariantA
            title="Digging fees"
            valid={parseInt(diggingFees) > 0}
          >
            <Image
              w="18px"
              h="18px"
              mr="0.5rem"
              src="sarco-token-icon.png"
              float="left"
            />
            {formatLargeNumber(diggingFees)}
          </RequirementVariantA>
        </Requirements>
      </StepElement>
    </StepsContainer>
  );
}
