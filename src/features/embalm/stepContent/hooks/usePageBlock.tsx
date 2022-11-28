import { History, Transition } from 'history';
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

import { useContext, useEffect, useState } from 'react';
import { Navigator } from 'react-router';
import {
  UNSAFE_NavigationContext as NavigationContext,
  useLocation,
  useNavigate,
} from 'react-router-dom';
// import { useSarcoModal } from 'components/SarcoModal';

export type ExtendNavigator = Navigator & Pick<History, 'block'>;

export function useBlocker(blocker: (tx: Transition) => void) {
  const { navigator } = useContext(NavigationContext);

  useEffect(() => {
    const unblock = (navigator as ExtendNavigator).block((tx: Transition) => {
      const autoUnblockingTx: Transition = {
        ...tx,
        retry() {
          unblock();
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);
    });

    return unblock;
  }, [navigator, blocker]);
}

export default function usePromptFunction(route: (nextLocation: any) => boolean) {
  const blocker = (tx: Transition) => {
    return route(tx) && tx.retry();
  };

  useBlocker(blocker);
}

// the isBlocked prop helps us to signal to the Modal whether the navigation should be stopped or not
export function CustomModal() {
  const location = useLocation();
  // holds the last location that was blocked as its name suggests
  const [lastLocation, setLastLocation] = useState(location);
  // tracks whether the user has decided to leave the page through the modal
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldUnload, setShouldUnload] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    setShouldUnload(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  // showModal opens the Confirmation Modal and sets the next location that was initial blocked into lastLocation
  const showModal = (nextLocation: any) => {
    // We will add this function in a later section
    openModal();
    setLastLocation(nextLocation);
  };

  // gets the next location & determines whether the prompt is shown
  const handleBlockedRoute = (nextLocation: Location) => {
    if (!confirmedNavigation) {
      showModal(nextLocation);
      return false;
    }

    return true;
  };

  const handleConfirmNavigationClick = () => {
    // We will add this function in a later section
    closeModal();
    setConfirmedNavigation(true);
  };

  // Block react routes
  useEffect(() => {
    if (confirmedNavigation && lastLocation) {
      // Navigate to the previous blocked location with your navigate function
      setShouldUnload(true);
      console.log('lastLocation', lastLocation);
      console.log('lastLocation.pathname', lastLocation.pathname);
      navigate(lastLocation);
    }
  }, [confirmedNavigation, lastLocation, navigate]);

  usePromptFunction(handleBlockedRoute);

  return (
    <>
      <Modal
        onClose={closeModal}
        isOpen={isModalOpen}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />

          <ModalFooter>
            <Button
              colorScheme="blue"
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
