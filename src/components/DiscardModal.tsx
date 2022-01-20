import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
} from "@chakra-ui/react";
import useDiscardModal from "context/discardModalContext";

interface DiscardModalProps {
  discardPost: () => void;
}

const DiscardModal = ({ discardPost }: DiscardModalProps) => {
  const { isDiscardOpen, closeDiscardModal } = useDiscardModal();
  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isDiscardOpen}
      onClose={closeDiscardModal}
      isCentered
    >
      <ModalOverlay />
      <ModalContent width="350px">
        <ModalHeader textAlign="center">Discard this post?</ModalHeader>
        <ModalBody>
          <Text textAlign="center">
            The video and all edits will be discarded
          </Text>
        </ModalBody>

        <ModalFooter justifyContent="center" flexDir="column" gap="10px">
          <Button
            color="red"
            variant="ghost"
            mr={3}
            onClick={discardPost}
            width="100%"
          >
            Discard
          </Button>
          <Button onClick={closeDiscardModal} variant="ghost" width="100%">
            Continue editing
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DiscardModal;
