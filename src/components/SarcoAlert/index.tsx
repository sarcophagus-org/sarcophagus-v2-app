import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  AlertStatus,
  Grid,
  GridItem,
  HTMLChakraProps,
  AlertProps as CharkraAlertProps,
} from '@chakra-ui/react';
import { SuccessIcon, InfoIcon, WarningIcon, ErrorIcon } from 'components/icons';
interface AlertProps extends CharkraAlertProps {
  onClose?: () => void;
}
const StatusMap = {
  info: { icon: InfoIcon },
  warning: { icon: WarningIcon },
  success: { icon: SuccessIcon },
  error: { icon: ErrorIcon },
  loading: { icon: InfoIcon }, // not supported
};
function getStatusIcon(status: AlertStatus) {
  return StatusMap[status].icon;
}

export function SarcoAlert(props: AlertProps & HTMLChakraProps<'div'>) {
  const { status = 'info', title, children } = props;
  const hasTitle = !!title;
  const StatusIcon = getStatusIcon(status);
  return (
    <Alert {...props}>
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
          <AlertIcon>{<StatusIcon boxSize="20px" />}</AlertIcon>
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
