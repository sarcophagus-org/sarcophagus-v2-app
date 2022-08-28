import { useSelector } from 'store/index';
import { StepMap, steps } from '../stepNavigator/steps';
import { useStepNavigator } from '../stepNavigator/useStepNavigator';

export function useStepContent() {
  const currentStepId = useSelector(x => x.embalmState.currentStepId);
  const { selectStepByIndex } = useStepNavigator();
  const stepCount = steps.length;

  const currentStep = StepMap[currentStepId];

  /**
   * Go to the previous step
   */
  function goToPrev() {
    const prevIndex = currentStep.index > 0 ? currentStep.index - 1 : 0;
    selectStepByIndex(prevIndex);
  }

  /**
   * Go to the next step
   */
  function goToNext() {
    const maxIndex = stepCount - 1;
    const nextIndex = currentStep.index < maxIndex ? currentStep.index + 1 : maxIndex;
    selectStepByIndex(nextIndex);
  }

  return { currentStep, stepCount, goToPrev, goToNext };
}
