import { useEnterKeyCallback } from 'hooks/useEnterKeyCallback';
import { Step } from 'store/embalm/reducer';
import { useSarcophagusParameters } from './useSarcophagusParameters';
import { useStepContent } from './useStepContent';

/**
 * Adds an "Enter" keydown event listener that goes to the
 * next step in the create sarco form if `canGoNext` is true
 * */
export function useEnterToNextStep() {
  const { goToNext, currentStep } = useStepContent();
  const { sarcophagusParameters } = useSarcophagusParameters();

  useEnterKeyCallback(() => {
    if (currentStep === Step.CreateSarcophagus) return;

    const currentStepParams = sarcophagusParameters.find(s => s.step === currentStep);

    const canGoNext =
      currentStep === Step.NameSarcophagus
        ? !currentStepParams?.error &&
          !sarcophagusParameters.find(s => s.name === 'RESURRECTION')?.error
        : !currentStepParams?.error;

    if (canGoNext) {
      goToNext();
    }
  });
}
