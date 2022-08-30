import { goToStep, setExpandedStepIndices, toggleStep } from 'store/embalm/actions';
import { Step, StepStatus } from 'store/embalm/reducer';
import { useDispatch, useSelector } from 'store/index';

export function useStepNavigator() {
  const dispatch = useDispatch();
  const { stepStatuses, currentStep } = useSelector(x => x.embalmState);

  // Plugs in to the accordion to control which steps are expanded
  const expandedIndices = useSelector(x => x.embalmState.expandedStepIndices);

  /**
   * Get the step status of a step
   */
  function getStatus(step: Step): StepStatus {
    return stepStatuses[currentStep] !== StepStatus.Complete && currentStep === step
      ? StepStatus.Started
      : stepStatuses[step];
  }

  /**
   * Select a step by the step id, expanding that step and collapsing others
   */
  function selectStep(step: Step) {
    dispatch(setExpandedStepIndices([step]));
    dispatch(goToStep(step));
  }

  /**
   * Toggle a step's expanded status
   */
  function toggleStepExpanded(step: Step) {
    dispatch(toggleStep(step));
  }

  return {
    currentStep,
    expandedIndices,
    getStatus,
    selectStep,
    stepStatuses,
    toggleStep: toggleStepExpanded,
  };
}
