import { goToStep, setExpandedStepIndices, toggleStep } from 'store/embalm/actions';
import { StepStatus } from 'store/embalm/reducer';
import { useDispatch, useSelector } from 'store/index';
import { StepMap, steps } from './steps';

export function useStepNavigator() {
  const dispatch = useDispatch();
  const { stepStatuses, currentStepId } = useSelector(x => x.embalmState);
  const expandedIndices = useSelector(x => x.embalmState.expandedStepIndices);

  /**
   * Select a step by the step id, expanding that step and collapsing others
   */
  function selectStep(id: string) {
    dispatch(setExpandedStepIndices([StepMap[id].index]));
    dispatch(goToStep(id));
  }

  /**
   * Select a step by index
   */
  function selectStepByIndex(index: number) {
    const id = steps[index].id;
    selectStep(id);
  }

  /**
   * Toggle a step's expanded status
   */
  function toggleStepExpanded(id: string) {
    dispatch(toggleStep(id));
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
    calculateStatusOfCurrentStep,
    currentStepId,
    expandedIndices,
    selectStep,
    selectStepByIndex,
    stepStatuses,
    toggleStep: toggleStepExpanded,
  };
}
