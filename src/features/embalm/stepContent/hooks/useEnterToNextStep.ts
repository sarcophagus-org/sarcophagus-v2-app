import { useEffect } from 'react';
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

    useEffect(() => {
        if (currentStep === Step.CreateSarcophagus) return;

        const currentStepParams = sarcophagusParameters.find(s => s.step === currentStep);

        const canGoNext = currentStep === Step.NameSarcophagus ?
            !currentStepParams?.error && !sarcophagusParameters.find(s => s.name === 'RESURRECTION')?.error :
            !currentStepParams?.error;

        const keyDownHandler = (event: any) => {
            if (event.key === 'Enter' && canGoNext) {
                event.preventDefault();
                goToNext();
            }
        };

        document.addEventListener('keydown', keyDownHandler);

        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, [goToNext, currentStep, sarcophagusParameters]);
}