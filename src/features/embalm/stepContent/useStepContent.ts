import { goToStepByIndex } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { StepMap, steps } from '../stepNavigator/steps';

export function useStepContent() {
  const dispatch = useDispatch();
  const currentStepId = useSelector(x => x.embalmState.currentStepId);
  const stepCount = steps.length;

  const currentStep = StepMap[currentStepId];

  function goToPrev() {
    const prevIndex = currentStep.index > 0 ? currentStep.index - 1 : 0;
    dispatch(goToStepByIndex(prevIndex));
  }

  function goToNext() {
    const maxIndex = stepCount - 1;
    const nextIndex = currentStep.index < maxIndex ? currentStep.index + 1 : maxIndex;
    dispatch(goToStepByIndex(nextIndex));
  }

  return { currentStep, stepCount, goToPrev, goToNext };
}
