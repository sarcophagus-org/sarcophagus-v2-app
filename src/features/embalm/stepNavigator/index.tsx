import { Text } from '@chakra-ui/react';
import { minimumResurrection } from 'lib/constants';
import { formatLargeNumber, humanizeDuration, zeroIfEmpty } from 'lib/utils/helpers';
import prettyBytes from 'pretty-bytes';
import { Step } from 'store/embalm/reducer';
import { useSelector } from 'store/index';
import { useGetBalance } from '../stepContent/hooks/useGetBalance';
import Requirement from './components/Requirement';
import { Requirements } from './components/Requirements';
import { SarcoAmount } from './components/SarcoAmount';
import { StepElement } from './components/StepElement';
import { StepsContainer } from './components/StepsContainer';
import {
  useSetStatuses,
  validateRequiredArchaeologists,
  validateTotalArchaeologists,
  validateRecipient,
} from './hooks/useSetStatuses';
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
  const {
    diggingFees,
    file,
    name,
    outerPrivateKey,
    outerPublicKey,
    recipient,
    requiredArchaeologists,
    resurrection,
    totalArchaeologists,
  } = useSelector(x => x.embalmState);
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
          <Requirement valid={name.length > 0}>Name: {name}</Requirement>
        </Requirements>
      </StepElement>

      <StepElement
        step={Step.UploadPayload}
        title="Upload Payload"
      >
        <Requirements>
          <Requirement valid={!!file}>Payload: {file ? prettyBytes(file.size) : ''}</Requirement>
        </Requirements>
      </StepElement>

      <StepElement
        step={Step.FundBundlr}
        title="Fund Arweave Bundlr"
        isLoading={isFunding}
      >
        <Requirements>
          <Requirement valid={parseFloat(balance) > parseFloat(uploadPrice)}>
            Bundlr balance: <Text variant="seoncdary">{formattedBalance}</Text>
          </Requirement>
        </Requirements>
      </StepElement>

      <StepElement
        step={Step.SetRecipient}
        title="Set Recipient"
      >
        <Requirements>
          <Requirement valid={validateRecipient(recipient)}>Recipient Public Key</Requirement>
        </Requirements>
      </StepElement>

      <StepElement
        step={Step.CreateEncryptionKeypair}
        title="Create Encryption Keypair"
      >
        <Requirements>
          <Requirement valid={!!outerPublicKey && !!outerPrivateKey}>
            Key pair generated
          </Requirement>
        </Requirements>
      </StepElement>
      <StepElement
        step={Step.Resurrections}
        title="Resurrections"
      >
        <Requirements>
          <Requirement valid={resurrection >= minimumResurrection}>
            First rewrap: {humanizeDuration(resurrection)}
          </Requirement>
        </Requirements>
      </StepElement>
      <StepElement
        step={Step.SetDiggingFees}
        title="Set Digging Fees"
      >
        <Requirements>
          <Requirement valid={parseInt(diggingFees) > 0}>
            <SarcoAmount>{zeroIfEmpty(formatLargeNumber(diggingFees))}</SarcoAmount>
            {/* <SarcoAmount>{diggingFees !== '' ? formatLargeNumber(diggingFees) : '0'}</SarcoAmount> */}
          </Requirement>
        </Requirements>
      </StepElement>
      <StepElement
        step={Step.TotalRequiredArchaeologists}
        title="Total/Required Archaeologists"
      >
        <Requirements>
          <Requirement valid={validateTotalArchaeologists(totalArchaeologists)}>
            {zeroIfEmpty(totalArchaeologists)} Archaeologists Total
          </Requirement>
          <Requirement
            valid={validateRequiredArchaeologists(requiredArchaeologists, totalArchaeologists)}
          >
            {zeroIfEmpty(requiredArchaeologists)} to unwrap
          </Requirement>
        </Requirements>
      </StepElement>

      <StepElement
        step={Step.SelectArchaeologists}
        title="Select Archaeologists"
      >
        <Requirements>
          <Requirement valid={false}>WIP</Requirement>
        </Requirements>
      </StepElement>
    </StepsContainer>
  );
}
