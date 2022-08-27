import { goToStep } from 'store/embalm/actions';
import { StepStatus } from 'store/embalm/reducer';
import { useDispatch, useSelector } from 'store/index';

export function useStepNavigator() {
  const dispatch = useDispatch();
  const { stepStatuses, currentStepId } = useSelector(x => x.embalmState);

  function selectStep(id: string) {
    dispatch(goToStep(id));
  }

  /**
   * Calculates what the status of a step should be
   */
  function calculateStatusOfCurrentStep(id: string) {
    if (currentStepId === id && stepStatuses[id] !== StepStatus.Complete) {
      return StepStatus.Started;
    } else {
      return stepStatuses[id] || StepStatus.NotStarted;
    }
  }

  return {
    selectStep,
    stepStatuses,
    currentStepId,
    calculateStatusOfCurrentStep,
  };
}
