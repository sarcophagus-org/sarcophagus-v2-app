import { Accordion } from '@chakra-ui/react';
import React, { FunctionComponentElement } from 'react';
import { useSelector } from 'store/index';
import { useStepNavigator } from '../hooks/useStepNavigator';
import { StepProps } from './StepElement';

interface StepsContainerProps {
  children: FunctionComponentElement<StepProps>[];
}

export function StepsContainer({ children }: StepsContainerProps) {
  const { expandedIndices } = useStepNavigator();

  // Other areas of the app should be able to disable the selection of the steps, like while the
  // sarcophagus is being created.
  const areStepsDisabled = useSelector(x => x.embalmState.areStepsDisabled);

  // Passes the isDisabled prop to the children
  // https://stackoverflow.com/a/32371612/9285856
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement<StepProps>(child, { isDisabled: areStepsDisabled });
    }
    return child;
  });

  return (
    <Accordion
      w="100%"
      allowMultiple
      index={expandedIndices}
    >
      {childrenWithProps}
    </Accordion>
  );
}
