import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import useSuccessModal from "context/successModalContext";

interface SuccessModalProps {
  handleViewProfile: () => void;
  handleConfirm: () => void;
}

const SuccessModal = ({
  handleViewProfile,
  handleConfirm,
}: SuccessModalProps) => {
  const { isSuccessOpen, closeSuccessModal } = useSuccessModal();

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isSuccessOpen}
      onClose={closeSuccessModal}
      isCentered
    >
      <ModalOverlay />
      <ModalContent width="350px">
        <ModalBody>
          <Text
            fontSize="xl"
            textAlign="center"
            fontWeight="semibold"
            margin="10px"
          >
            Your video is being
          </Text>
          <Text textAlign="center" color="gray.500">
            uploaded to Tiktok
          </Text>
        </ModalBody>

        <ModalFooter justifyContent="center" flexDir="column" gap="10px">
          <Button variant="ghost" mr={3} onClick={handleConfirm} width="100%">
            Upload another video
          </Button>
          <Button
            onClick={handleViewProfile}
            variant="ghost"
            width="100%"
            color="red"
          >
            View profile
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SuccessModal;
