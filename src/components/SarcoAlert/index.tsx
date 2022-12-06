import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  AlertStatus,
  Grid,
  GridItem,
  HTMLChakraProps,
} from '@chakra-ui/react';
import { SuccessIcon, InfoIcon, WarningIcon, ErrorIcon } from 'components/icons';

interface AlertProps {
  children: React.ReactNode;
  status: AlertStatus;
  title?: string;
}

const StatusMap = {
  info: { icon: InfoIcon, color: 'blue' },
  warning: { icon: WarningIcon, color: 'orange' },
  success: { icon: SuccessIcon, color: 'green' },
  error: { icon: ErrorIcon, color: 'red' },
  loading: { icon: InfoIcon, color: 'black' }, // not supported
};

function getStatusIcon(status: AlertStatus) {
  return StatusMap[status].icon;
}

function getStatusIconColor(status: AlertStatus) {
  return StatusMap[status].color;
}

export function SarcoAlert(props: AlertProps & HTMLChakraProps<'div'>) {
  const { status, title, children } = props;

  const hasTitle = !!title;
  const StatusIcon = getStatusIcon(status);
  return (
    <Alert
      {...props}
      // Required to override the default css border styling for the toasts in src/theme/styles.ts
      style={{
        border: 'none',
      }}
    >
      <Grid
        alignItems={hasTitle ? 'flex-start' : 'center'}
        templateAreas={
          hasTitle
            ? `"icon title"
               "blank description"`
            : '"icon description"'
        }
      >
        <GridItem area="icon">
          <AlertIcon>
            {
              <StatusIcon
                boxSize="20px"
                color={getStatusIconColor(status)}
              />
            }
          </AlertIcon>
        </GridItem>

        {!hasTitle || (
          <GridItem area="title">
            <AlertTitle>{title}</AlertTitle>
          </GridItem>
        )}
        <GridItem area="description">
          <AlertDescription>{children}</AlertDescription>
        </GridItem>
      </Grid>
    </Alert>
  );
}
