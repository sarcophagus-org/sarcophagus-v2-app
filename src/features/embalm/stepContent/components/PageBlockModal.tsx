import { Transition } from 'history';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { colors } from 'theme/colors';
import usePrompt from '../hooks/usePageBlock';
import { useClearSarcophagusState } from '../hooks/useCreateSarcophagus/useClearSarcophagusState';
import { useDispatch } from 'store/index';
import { goToStep } from 'store/embalm/actions';
import { Step } from 'store/embalm/reducer';

export function PageBlockModal() {
  const { clearSarcophagusState } = useClearSarcophagusState();
  const dispatch = useDispatch();
  const location = useLocation();
  const [lastLocation, setLastLocation] = useState(location);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const showModal = (nextLocation: Transition) => {
    openModal();
    setLastLocation(nextLocation.location);
  };

  const clearState = useCallback(() => {
    clearSarcophagusState();
    dispatch(goToStep(Step.NameSarcophagus));
  }, [clearSarcophagusState, dispatch]);

  const handleBlockedRoute = (nextLocation: Transition) => {
    if (!confirmedNavigation) {
      showModal(nextLocation);
      return false;
    }
    return true;
  };

  const handleConfirmNavigationClick = () => {
    closeModal();
    setConfirmedNavigation(true);
  };

  useEffect(() => {
    if (confirmedNavigation && lastLocation) {
      clearState();
      navigate(lastLocation.pathname);
    }
  }, [confirmedNavigation, lastLocation, navigate, clearState]);

  usePrompt(handleBlockedRoute);

  return (
    <>
      <Modal
        onClose={closeModal}
        isOpen={isModalOpen}
        isCentered
      >
        <ModalOverlay />
        <ModalContent bgColor={colors.brand[100]}>
          <ModalHeader>Attention</ModalHeader>
          <ModalCloseButton />

          <ModalBody>Your progress will be lost if you change page.</ModalBody>
          <ModalFooter alignSelf={'center'}>
            <Button
              variant="ghost"
              mr={3}
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmNavigationClick}>Leave</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
