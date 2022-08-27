import { UploadPayload } from 'features/embalm/stepContent/steps/UploadPayload';
import { StepName } from 'store/embalm/reducer';
import { useSelector } from 'store/index';
import { CreateRecipientKeypair } from './steps/CreateRecipientKeypair';
import { NameSarcophagus } from './steps/NameSarcophagus';
import { SelectArchaeologists } from './steps/SelectArchaeologists';
import { SetArchaeologistBounties } from './steps/SetArchaeologistBounties';
import { SetResurrectionDate } from './steps/SetResurrectionDate';

const stepMap: { [key: string]: JSX.Element } = {
  [StepName.NameSarcophagusAndAddRecipient]: <NameSarcophagus />,
  [StepName.UploadPayload]: <UploadPayload />,
  [StepName.CreateRecipientKeypair]: <CreateRecipientKeypair />,
  [StepName.SetResurrectionDate]: <SetResurrectionDate />,
  [StepName.SetArchaeologistBounties]: <SetArchaeologistBounties />,
  [StepName.SelectArchaeologists]: <SelectArchaeologists />,
};

export function StepContent() {
  const currentStep = useSelector(x => x.embalmState.currentStep);

  return stepMap[currentStep];
}
