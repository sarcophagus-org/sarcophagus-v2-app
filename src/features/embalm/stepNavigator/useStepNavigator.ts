import { goToStep } from 'store/embalm/actions';
import { StepName, StepStatus } from 'store/embalm/reducer';
import { useDispatch, useSelector } from 'store/index';

export function useStepNavigator() {
  const dispatch = useDispatch();
  const { stepStatuses, currentStep } = useSelector(x => x.embalmState);

  function selectStep(name: StepName) {
    dispatch(goToStep(name));

    // TODO: Manage how the step statuses are changed when moving around to different steps
    // Determining which steps are complete will be done by checking if all fields in the step are
    // filled.
  }

  /**
   * Given the step you are on, calculates what the step's status should be
   */
  function calculateStatusOfCurrentStep(name: StepName): StepStatus {
    // TODO: This calculation will probably change or go away
    if (currentStep === name && stepStatuses[currentStep] !== StepStatus.Complete) {
      return StepStatus.Started;
    } else {
      return stepStatuses[name];
    }
  }

  return {
    selectStep,
    stepStatuses,
    currentStep,
    calculateStatusOfCurrentStep,
  };
}
