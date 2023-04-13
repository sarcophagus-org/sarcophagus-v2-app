import React from 'react';
import { Tooltip, TooltipProps } from '@chakra-ui/react';

interface MultiLineTooltipProps extends TooltipProps {
  lines?: string[];
}

export function MultiLineTooltip({ lines, children, ...rest }: MultiLineTooltipProps) {
  if (!lines || lines.length === 0) {
    return <>{children}</>;
  }

  const tooltipContent = (
    <>
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );

  return (
    <Tooltip
      label={tooltipContent}
      {...rest}
    >
      {children}
    </Tooltip>
  );
}
