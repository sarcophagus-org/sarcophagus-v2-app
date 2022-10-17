import { useSelector } from '../../../../store';
import { useStepNavigator } from '../../stepNavigator/hooks/useStepNavigator';
import { Step, StepStatus } from 'store/embalm/reducer';

export const useSarcophagusData = () => {
  const {
    name,
    resurrection,
    recipientState,
    file,
    selectedArchaeologists,
    requiredArchaeologists
  } = useSelector(x => x.embalmState);

  const { getStatus } = useStepNavigator();

  // TODO -- format values appropriately according to designs
  // TODO -- update Bundlr to get actual balance
  const sarcophagusDataMap = new Map<string, string | undefined>([
    ['NAME', name],
    ['RESURRECTION', resurrection.toString()],
    ['RECIPIENT', recipientState.publicKey],
    ['PAYLOAD', file?.name],
    ['BUNDLR BALANCE', '0.14 ETH'],
    ['ARCHAEOLOGISTS', selectedArchaeologists.toString()],
    ['REQUIRED ARCHAEOLOGISTS', requiredArchaeologists.toString()]
  ]);

  const canCreateSarcophagus = (): boolean => {
    // Check statuses of specific steps
    // TODO -- enable bundlr & select archaeologists when those are completed
    const requiredSteps = [
      Step.NameSarcophagus,
      Step.UploadPayload,
      // Step.FundBundlr,
      Step.SetRecipient,
      Step.CreateEncryptionKeypair,
      // Step.SelectArchaeologists,
      Step.TotalRequiredArchaeologists
    ];

    return requiredSteps.every(step => {
      return getStatus(step) !== StepStatus.Complete;
    });
  };

  return {
    sarcophagusDataMap,
    canCreateSarcophagus
  };
};