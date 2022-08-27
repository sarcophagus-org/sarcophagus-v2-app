import { VStack } from '@chakra-ui/react';
import { StepName } from 'store/embalm/reducer';
import { StepElement } from './stepElement';
import { useStepNavigator } from './useStepNavigator';

/**
 * The embalm step navigator.
 * Uses the state in the store to keep track of the current step.
 * Does not use routes to track the current step.
 */
export function StepNavigator() {
  const { selectStep, calculateStatusOfCurrentStep } = useStepNavigator();

  // Keep in mind that these steps are likely to change
  const steps = [
    {
      id: StepName.NameSarcophagusAndAddRecipient,
      title: '1. Name Sarcophagus and add recipient',
      subTitle: 'Room for brief helper sentence',
    },
    {
      id: StepName.UploadPayload,
      title: '2. Upload your payload',
      subTitle: 'Room for brief helper sentence',
    },
    {
      id: StepName.CreateRecipientKeypair,
      title: '3. Create recipient keypair',
      subTitle: 'Room for brief helper sentence',
    },
    {
      id: StepName.SetResurrectionDate,
      title: '4. Set resurrection date',
      subTitle: 'Room for brief helper sentence',
    },
    {
      id: StepName.SetArchaeologistBounties,
      title: '5. Set archaeologist bounties',
      subTitle: 'Room for brief helper sentence',
    },
    {
      id: StepName.SelectArchaeologists,
      title: '6. Select archaeologists',
      subTitle: 'Room for brief helper sentence',
    },
  ];

  function handleClickStep(step: StepName) {
    // Set the current step in the store
    selectStep(step);
  }

  return (
    <VStack
      spacing={9}
      align="left"
      pr={6}
    >
      {steps.map(step => (
        <StepElement
          key={step.id}
          title={step.title}
          subTitle={step.subTitle}
          status={calculateStatusOfCurrentStep(step.id)}
          onClickStep={() => handleClickStep(step.id)}
        />
      ))}
    </VStack>
  );
}
