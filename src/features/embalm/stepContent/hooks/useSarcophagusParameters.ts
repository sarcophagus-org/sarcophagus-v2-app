import { useSelector } from '../../../../store';
import { useStepNavigator } from '../../stepNavigator/hooks/useStepNavigator';
import { Step, StepStatus } from 'store/embalm/reducer';
import { formatAddress, humanizeUnixTimestamp } from '../../../../lib/utils/helpers';

export interface SarcophagusParameter {
  name: string;
  value: string | null;
  step: Step;
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
    requiredArchaeologists
  } = useSelector(x => x.embalmState);

  const { getStatus } = useStepNavigator();

  // TODO -- update Bundlr to get actual balance
  const sarcophagusParameters: SarcophagusParameter[] = [
    {
      name: 'NAME',
      value: name || null,
      step: Step.NameSarcophagus
    },
    {
      name: 'RESURRECTION',
      value: resurrection ? humanizeUnixTimestamp(resurrection) : null,
      step: Step.NameSarcophagus
    },
    {
      name: 'RECIPIENT',
      value: recipientState.publicKey ? formatAddress(recipientState.publicKey) : null,
      step: Step.SetRecipient
    },
    {
      name: 'PAYLOAD',
      value: file ? file.name : null,
      step: Step.UploadPayload
    },
    {
      name: 'BUNDLR BALANCE',
      value: null,
      step: Step.FundBundlr
    },
    {
      name: 'SELECTED ARCHAEOLOGISTS',
      value: selectedArchaeologists.length ? selectedArchaeologists.length.toString() : null,
      step: Step.SelectArchaeologists
    },
    {
      name: 'REQUIRED ARCHAEOLOGISTS',
      value: requiredArchaeologists ? requiredArchaeologists.toString() : null,
      step: Step.RequiredArchaeologists
    }
  ];


  /**
   * Returns true if all required data for the sarcophagus has been supplied
   * */
  const isSarcophagusComplete = (): boolean => {
    // TODO -- enable bundlr
    const requiredSteps = [
      Step.NameSarcophagus,
      Step.UploadPayload,
      // Step.FundBundlr,
      Step.SetRecipient,
      Step.SelectArchaeologists,
      Step.RequiredArchaeologists
    ];

    return requiredSteps.every(step => getStatus(step) === StepStatus.Complete);
  };

  return {
    sarcophagusParameters,
    isSarcophagusComplete
  };
};
