import { CreateRecipientKeypair } from '../stepContent/steps/CreateRecipientKeypair';
import { NameSarcophagus } from '../stepContent/steps/NameSarcophagus';
import { SelectArchaeologists } from '../stepContent/steps/SelectArchaeologists';
import { SetArchaeologistBounties } from '../stepContent/steps/SetArchaeologistBounties';
import { SetResurrectionDate } from '../stepContent/steps/SetResurrectionDate';
import { UploadPayload } from '../stepContent/steps/UploadPayload';

export interface Step {
  index: number;
  id: string;
  title: string;
  subtitle: string;
  component: () => JSX.Element;
}

// Abstracted out steps so that they will be easier to modify
export const StepMap: { [key: string]: Step } = {
  NameSarcophagus: {
    id: 'NameSarcophagus',
    index: 1,
    title: 'Name Sarcophagus and add recipient',
    subtitle: 'Room for brief helper sentence',
    component: NameSarcophagus,
  },
  UploadPayload: {
    id: 'UploadPayload',
    index: 2,
    title: 'Upload payload',
    subtitle: 'Room for brief helper sentence',
    component: UploadPayload,
  },
  CreateRecipientKeypair: {
    id: 'CreateRecipientKeypair',
    index: 3,
    title: 'Create recipient keypair',
    subtitle: 'Room for brief helper sentence',
    component: CreateRecipientKeypair,
  },
  SetResurrectionDate: {
    id: 'SetResurrectionDate',
    index: 4,
    title: 'Set resurrection date',
    subtitle: 'Room for brief helper sentence',
    component: SetResurrectionDate,
  },
  SetArchaeologistBounties: {
    id: 'SetArchaeologistBounties',
    index: 5,
    title: 'Set archaeologist bounties',
    subtitle: 'Room for brief helper sentence',
    component: SetArchaeologistBounties,
  },
  SelectArchaeologists: {
    id: 'SelectArchaeologists',
    index: 6,
    title: 'Select archaeologists',
    subtitle: 'Room for brief helper sentence',
    component: SelectArchaeologists,
  },
};

// Export an array version of the step map setting the key to the id
export const steps: Step[] = Object.keys(StepMap).map(key => ({ ...StepMap[key], id: key }));
