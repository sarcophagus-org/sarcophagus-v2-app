import { Step } from 'store/embalm/reducer';
import { useSelector } from 'store/index';
import { useStepNavigator } from '../../stepNavigator/hooks/useStepNavigator';

export function useStepContent() {
  const { currentStep, sponsorBundlr } = useSelector(x => x.embalmState);
  const { selectStep } = useStepNavigator();

  // Divide by 2 because an enum has double the number of values as it does keys
  // console.log(Step) for more clarity
  const stepCount = Object.keys(Step).length / 2;

  /**
   * Go to the previous step
   */
  function goToPrev() {
    const prevIndex = currentStep.valueOf() > 0 ? currentStep.valueOf() - 1 : 0;
    selectStep(prevIndex);
  }

  /**
   * Go to the next step
   */
  function goToNext() {
    const maxIndex = stepCount - 1;
    const nextIndex = currentStep.valueOf() < maxIndex ? currentStep.valueOf() + 1 : maxIndex;

    const skipFundBundrStep = currentStep === Step.UploadPayload && sponsorBundlr;

    selectStep(nextIndex + (skipFundBundrStep ? 1 : 0));
  }

  return { currentStep, stepCount, goToPrev, goToNext };
}
