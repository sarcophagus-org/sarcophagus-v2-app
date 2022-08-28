import { CreateRecipientKeypair } from '../stepContent/steps/CreateRecipientKeypair';
import { FinalizeSarcophagus } from '../stepContent/steps/FinalizeSarcophagus';
import { InitializeSarcophagus } from '../stepContent/steps/InitializeSarcophagus';
import { NameSarcophagus } from '../stepContent/steps/NameSarcophagus';
import { SelectArchaeologists } from '../stepContent/steps/SelectArchaeologists';
import { SetArchaeologistBounties } from '../stepContent/steps/SetArchaeologistBounties';
import { SetResurrectionDate } from '../stepContent/steps/SetResurrectionDate';
import { UploadPayload } from '../stepContent/steps/UploadPayload';

export interface Step {
  index: number;
  id: string;
  title: string;
  component: () => JSX.Element;
  requirements?: { [key: string]: Requirement };
}

export interface Requirement {
  id: string;
  title: string;
}

// Abstracted out steps so that they will be easier to modify
export const StepMap: { [key: string]: Step } = {
  NameSarcophagus: {
    id: 'NameSarcophagus',
    index: 0,
    title: 'Name Sarcophagus and add recipient',
    component: NameSarcophagus,
    requirements: {
      NameComplete: {
        id: 'NameComplete',
        title: 'Name sarcophagus',
      },
      RecipientsPublicKeyComplete: {
        id: 'RecipientsPublicKeyComplete',
        title: "Recipient's public key",
      },
    },
  },
  UploadPayload: {
    id: 'UploadPayload',
    index: 1,
    title: 'Upload payload',
    component: UploadPayload,
    requirements: {
      UploadPayload: {
        id: 'UploadPayload',
        title: 'Upload payload',
      },
    },
  },
  CreateRecipientKeypair: {
    id: 'CreateRecipientKeypair',
    index: 2,
    title: 'Create recipient keypair',
    component: CreateRecipientKeypair,
    requirements: {
      CreateKeypair: {
        id: 'CreateKeypair',
        title: 'Create keypair',
      },
    },
  },
  SetResurrectionDate: {
    id: 'SetResurrectionDate',
    index: 3,
    title: 'Set resurrection date',
    component: SetResurrectionDate,
    requirements: {
      SetResurrectionDate: {
        id: 'SetResurrectionDate',
        title: 'Set resurrection date',
      },
      SetDiggingFees: {
        id: 'SetDiggingFees',
        title: 'Set digging fees',
      },
    },
  },
  SetArchaeologistBounties: {
    id: 'SetArchaeologistBounties',
    index: 4,
    title: 'Set archaeologist bounties',
    component: SetArchaeologistBounties,
    requirements: {
      SetTotalArchaeologists: {
        id: 'SetTotalArchaeologists',
        title: 'Set total archaeologists',
      },
      SetRequiredArchaeologists: {
        id: 'SetRequiredArchaeologists',
        title: 'Set required archaeologists',
      },
    },
  },
  SelectArchaeologists: {
    id: 'SelectArchaeologists',
    index: 5,
    title: 'Select archaeologists',
    component: SelectArchaeologists,
    requirements: {
      SelectArchaeologists: {
        id: 'SelectArchaeologists',
        title: 'Select archaeologists',
      },
    },
  },
  InitializeSarcophagus: {
    id: 'InitializeSarcophagus',
    index: 6,
    title: 'Initialize Sarcophagus',
    component: InitializeSarcophagus,
    requirements: {
      InitializeSarcophagus: {
        id: 'InitializeSarcophagus',
        title: 'Initialize Sarcophagus',
      },
    },
  },
  FinalizeSarcophagus: {
    id: 'FinalizeSarcophagus',
    index: 7,
    title: 'Finalize Sarcophagus',
    component: FinalizeSarcophagus,
    requirements: {
      FinalizeSarcophagus: {
        id: 'FinalizeSarcophagus',
        title: 'Finalize Sarcophagus',
      },
    },
  },
};

// Export an array version of the step map setting the key to the id
export const steps: Step[] = Object.keys(StepMap).map(key => ({ ...StepMap[key], id: key }));

// Export a function that returns a step's requirements as an array
export function getRequirementsForStep(id: string): Requirement[] {
  const requirements = StepMap[id].requirements;
  if (!requirements) return [];
  return Object.keys(requirements).map(key => ({ ...requirements[key], id: key }));
}
