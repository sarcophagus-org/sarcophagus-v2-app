import { useSelector } from '../../../../store';
import { useStepNavigator } from '../../stepNavigator/hooks/useStepNavigator';
import { Step, StepStatus } from 'store/embalm/reducer';
import { useNetworkConfig } from 'lib/config';
import { hardhatChainId } from 'lib/config/hardhat';
import {
  formatAddress,
  getLowestResurrectionTime,
  getLowestRewrapInterval,
  humanizeUnixTimestamp,
} from '../../../../lib/utils/helpers';
import moment from 'moment';
import { minimumResurrection } from 'lib/constants';
import { ethers } from 'ethers';

export interface SarcophagusParameter {
  name: string;
  value: string | null;
  step: Step;
  error: string | null;
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
  const { timestampMs } = useSelector(x => x.appState);

  const { getStatus } = useStepNavigator();
  const { chainId } = useNetworkConfig();

  const isHardhatNetwork = chainId === hardhatChainId;
  const maxRewrapIntervalMs = getLowestRewrapInterval(selectedArchaeologists) * 1000;
  const maxResurrectionTimeMs = getLowestResurrectionTime(selectedArchaeologists) * 1000; // TODO: will be combined with `getLowestRewrapInterval` above

  const resurrectionTimeError = !resurrection
    ? 'Please set a resurrection time'
    : resurrection > maxRewrapIntervalMs + timestampMs
    ? 'The resurrection time you have selected is beyond the maximum rewrap interval of your selected archaeologists'
    : resurrection - minimumResurrection < timestampMs && resurrection !== 0
    ? `Resurrection must be ${moment
        .duration(minimumResurrection)
        .humanize()} or more in the future.`
    : null;

  const sarcophagusParameters: SarcophagusParameter[] = [
    {
      name: 'NAME',
      value: name,
      step: Step.NameSarcophagus,
      error: !name ? 'Your Sarchophagus needs a name' : null,
    },
    {
      name: 'RESURRECTION',
      value: resurrection ? humanizeUnixTimestamp(resurrection) : null,
      step: Step.NameSarcophagus,
      error: resurrectionTimeError,
    },
    {
      name: 'MAXIMUM RESURRECTION TIME',
      value: selectedArchaeologists.length
        ? `${humanizeUnixTimestamp(maxResurrectionTimeMs)}`
        : null,
      step: Step.SelectArchaeologists,
      error: !selectedArchaeologists.length ? 'You have not selected any archaeologists' : null,
    },
    {
      name: 'MAXIMUM REWRAP INTERVAL',
      value: selectedArchaeologists.length
        ? `~${moment.duration(maxRewrapIntervalMs).asMonths().toFixed(2).toString()} months`
        : null,
      step: Step.SelectArchaeologists,
      error: !selectedArchaeologists.length ? 'You have not selected any archaeologists' : null,
    },
    {
      name: 'RECIPIENT',
      value: recipientState.publicKey ? formatAddress(recipientState.publicKey) : null,
      step: Step.SetRecipient,
      error: !recipientState.publicKey ? "You have not set your recipient's public key" : null,
    },
    {
      name: 'PAYLOAD',
      value: file ? file.name : null,
      step: Step.UploadPayload,
      error: !file ? 'You have not selected a file to embalm' : null,
    },
    {
      name: 'BUNDLR BALANCE',
      value: ethers.utils.formatUnits(balance),
      step: Step.FundBundlr,
      error:
        !isHardhatNetwork && (balance.eq(ethers.constants.Zero) || !balance)
          ? 'You do not have enough balance on Bundlr'
          : null,
    },
    {
      name: 'SELECTED ARCHAEOLOGISTS',
      value: selectedArchaeologists.length.toString(),
      step: Step.SelectArchaeologists,
      error:
        selectedArchaeologists.length === 0 ? 'You have not selected any archaeologists' : null,
    },
    {
      name: 'REQUIRED ARCHAEOLOGISTS',
      value: requiredArchaeologists.toString(),
      step: Step.RequiredArchaeologists,
      error:
        requiredArchaeologists === 0
          ? 'You need to select how many archaeologists must be present to complete a resurrection'
          : null,
    },
  ];

  /**
   * Returns true if all required data for the sarcophagus has been supplied
   * */
  const isSarcophagusFormDataComplete = (): boolean => {
    // TODO -- enable bundlr
    const requiredSteps = [
      Step.NameSarcophagus,
      Step.UploadPayload,
      Step.FundBundlr,
      Step.SetRecipient,
      Step.SelectArchaeologists,
      Step.RequiredArchaeologists,
    ];

    return requiredSteps
      .filter(s => (!isHardhatNetwork ? true : s !== Step.FundBundlr)) // Not checking fund bundlr step when testing in hardhat
      .every(step => getStatus(step) === StepStatus.Complete);
  };

  const isError = Object.values(sarcophagusParameters).some(p => p.error);

  return {
    sarcophagusParameters,
    isSarcophagusFormDataComplete,
    isError,
  };
};
