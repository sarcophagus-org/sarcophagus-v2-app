import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { colors } from 'theme/colors';

interface ModalButtonProps {
    label: string;
    onClick: () => void;
    dismissesModal?: boolean;
}

interface SarcoModalProps {
    isDismissible?: boolean;
    image?: string;
    title: string;
    subtitle?: string;
    primaryButton: ModalButtonProps,
    secondaryButton?: ModalButtonProps,
}

function useSarcoModal(props: SarcoModalProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const {
        title,
        subtitle,
        image,
        primaryButton,
        secondaryButton,
        isDismissible = true,
    } = props;

    const modal = () =>
        <Modal closeOnOverlayClick={isDismissible} isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent bgColor={colors.brand[100]}>
                <ModalHeader>{title}</ModalHeader>
                {isDismissible && <ModalCloseButton />}
                <ModalBody>
                    <Text>{subtitle ?? ''}</Text>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={() => {
                        primaryButton.onClick();
                        if (primaryButton.dismissesModal) onClose();
                    }}>
                        {primaryButton.label}
                    </Button>
                    {secondaryButton &&
                        <Button variant='ghost' onClick={() => {
                            secondaryButton?.onClick();
                            if (secondaryButton?.dismissesModal) onClose();
                        }}>
                            {secondaryButton.label}
                        </Button>}
                </ModalFooter>
            </ModalContent>
        </Modal>;

    return { SarcoModal: modal, openModal: onOpen };
}

export { useSarcoModal };
