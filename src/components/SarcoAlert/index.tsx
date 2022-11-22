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
  info: { icon: InfoIcon, color: 'alert.info.accent' },
  warning: { icon: WarningIcon, color: 'alert.warning.accent' },
  success: { icon: SuccessIcon, color: 'alert.success.accent' },
  error: { icon: ErrorIcon, color: 'alert.error.accent' },
  loading: { icon: InfoIcon, color: 'black' }, // not supported
};
function getStatusIcon(status: AlertStatus) {
  return StatusMap[status].icon;
}
function getStatusIconColor(status: AlertStatus) {
  return StatusMap[status].color;
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
