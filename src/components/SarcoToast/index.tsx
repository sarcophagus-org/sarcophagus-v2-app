import {
  AlertStatus,
  CloseButton,
  HStack,
  ToastId,
  ToastProps as ChakraToastProps,
  useTheme,
  useToast,
} from '@chakra-ui/react';
import { SarcoAlert } from 'components/SarcoAlert';

const defaultDuration = 5000;
const defaultPosition = 'bottom-right';

export interface ToastProps extends Omit<ChakraToastProps, 'status' | 'description'> {
  description?: React.ReactNode;
  status: AlertStatus;
  title?: string;
}

export function useSarcoToast() {
  const theme = useTheme();
  const charkaToast = useToast();

  const open = (props: ToastProps): ToastId => {
    const { status, title, description, duration, position, isClosable } = props;

    const toastColorMap: { [key: string]: string } = {
      info: theme.colors.blue[100],
      warning: theme.colors.orange[100],
      success: theme.colors.green[100],
      error: theme.colors.red[100],
    };

    return charkaToast({
      duration: duration === undefined ? defaultDuration : duration,
      position: position || defaultPosition,
      ...props,
      render: ({ onClose }) => (
        <HStack
          alignItems="flex-start"
          spacing={0}
          bg={toastColorMap[status]}
        >
          <SarcoAlert
            title={title}
            status={status || 'info'}
            onClose={onClose}
          >
            {description}
          </SarcoAlert>
          {isClosable && <CloseButton onClick={onClose} />}
        </HStack>
      ),
    });
  };
  return { open, isActive: charkaToast.isActive };
}
