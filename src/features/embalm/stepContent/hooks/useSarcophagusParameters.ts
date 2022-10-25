import { useSelector } from '../../../../store';
import { useStepNavigator } from '../../stepNavigator/hooks/useStepNavigator';
import { Step, StepStatus } from 'store/embalm/reducer';
import { formatAddress, humanizeUnixTimestamp } from '../../../../lib/utils/helpers';

export interface SarcophagusParameter {
  name: string;
  value: string | null;
  step: Step;
  error: boolean;
}

/**
 * Loads the parameters set on a sarcophagus for the user to review
 * returns
 *  an array of objects containing a display name, value, and corresponding step for each parameter
 *  a function returning whether the user may proceed to create the sarcophagus
 * */
export const useSarcophagusParameters = () => {
  const {
    name,
    resurrection,
    recipientState,
    file,
    selectedArchaeologists,
    requiredArchaeologists,
  } = useSelector(x => x.embalmState);
  const { balance } = useSelector(x => x.bundlrState);

  const { getStatus } = useStepNavigator();

  // TODO -- update Bundlr to get actual balance
  const sarcophagusParameters: SarcophagusParameter[] = [
    {
      name: 'NAME',
      value: name,
      step: Step.NameSarcophagus,
      error: !name,
    },
    {
      name: 'RESURRECTION',
      value: resurrection ? humanizeUnixTimestamp(resurrection) : null,
      step: Step.NameSarcophagus,
      error: !resurrection,
    },
    {
      name: 'RECIPIENT',
      value: recipientState.publicKey ? formatAddress(recipientState.publicKey) : null,
      step: Step.SetRecipient,
      error: !recipientState.publicKey,
    },
    {
      name: 'PAYLOAD',
      value: file ? file.name : null,
      step: Step.UploadPayload,
      error: !file,
    },
    {
      name: 'BUNDLR BALANCE',
      value: balance,
      step: Step.FundBundlr,
      error: balance === '0' || !balance,
    },
    {
      name: 'SELECTED ARCHAEOLOGISTS',
      value: selectedArchaeologists.length.toString(),
      step: Step.SelectArchaeologists,
      error: selectedArchaeologists.length === 0,
    },
    {
      name: 'REQUIRED ARCHAEOLOGISTS',
      value: requiredArchaeologists.toString(),
      step: Step.RequiredArchaeologists,
      error: requiredArchaeologists === 0,
    },
  ];

  /**
   * Returns true if all required data for the sarcophagus has been supplied
   * */
  const isSarcophagusComplete = (): boolean => {
    // TODO -- enable bundlr
    const requiredSteps = [
      Step.NameSarcophagus,
      Step.UploadPayload,
      Step.FundBundlr,
      Step.SetRecipient,
      Step.SelectArchaeologists,
      Step.RequiredArchaeologists,
    ];

    return requiredSteps.every(step => getStatus(step) === StepStatus.Complete);
  };

  return {
    sarcophagusParameters,
    isSarcophagusComplete,
  };
};
