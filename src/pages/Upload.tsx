import {
  Flex,
  Text,
  Box,
  Center,
  Button,
  AspectRatio,
  CloseButton,
  Spacer,
  CircularProgress,
  CircularProgressLabel,
  useToast,
} from "@chakra-ui/react";
import DiscardModal from "components/DiscardModal";
import useDiscardModal from "context/discardModalContext";
import useSuccessModal from "context/successModalContext";
import useUser, { IUser } from "context/userContext";
import { RawDraftContentState } from "draft-js";
import useDragAndDrop from "hooks/useDragAndDrop";
import useFirebaseUpload from "hooks/useFirebaseUpload";
import { useEffect, useState } from "react";
import { MdOutlineCloudUpload } from "react-icons/md";
import { EditorState } from "draft-js";
import { useNavigate } from "react-router-dom";
import SuccessModal from "components/SuccessModal";
import DraftEditor from "components/DraftEditor";
import { nanoid } from "nanoid";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "util/firebase";

interface UploadSelectedFileProps {
  handleUpload: (file: File) => void;
}

interface UploadProgressProps {
  file: File | null;
  uploadProgress: number;
  cancelUpload: () => void;
}

interface UploadPreviewProps {
  videoUrl: string;
  discardUpload: () => void;
}

interface UploadFormProps {
  discardUpload: () => void;
  videoUrl: string;
  user: IUser | null;
}

export interface ICaption {
  rawData: RawDraftContentState | null;
  characterLength: number;
}

const Upload = () => {
  const { user } = useUser();
  const {
    handleUpload,
    videoUrl,
    isUploading,
    file,
    uploadProgress,
    cancelUpload,
    discardUpload,
  } = useFirebaseUpload(user);

  return (
    <Flex marginTop="100px" gap="50px" justifyContent="center">
      <Flex flexDir="column">
        <Text fontSize="5xl" fontWeight="bold" textAlign="center">
          Upload item
        </Text>
        <Text color="gray.400" textAlign="center">
          This video will be published to {user?.username}
        </Text>
        {videoUrl && (
          <UploadPreview videoUrl={videoUrl} discardUpload={discardUpload} />
        )}
        {!isUploading && !videoUrl ? (
          <UploadSelectedFile handleUpload={handleUpload} />
        ) : null}
        {isUploading && (
          <UploadProgress
            file={file}
            uploadProgress={uploadProgress}
            cancelUpload={cancelUpload}
          />
        )}
      </Flex>
      <UploadForm
        discardUpload={discardUpload}
        videoUrl={videoUrl}
        user={user}
      />
    </Flex>
  );
};

const UploadPreview = ({ videoUrl, discardUpload }: UploadPreviewProps) => {
  const { openDiscardModal, closeDiscardModal } = useDiscardModal();

  function discardPost() {
    discardUpload();
    closeDiscardModal();
  }

  return (
    <Flex
      flexDir="column"
      justify="center"
      height="500px"
      marginTop="10px"
      width="320px"
      gap="10px"
      position="relative"
    >
      <CloseButton
        size="md"
        top="-10px"
        left="-15px"
        position="absolute"
        zIndex="99"
        onClick={openDiscardModal}
        _focus={{ boxShadow: "none" }}
        _hover={{ backgroundColor: "none" }}
        _active={{ backgroundColor: "none" }}
        bg="red.500"
        color="white"
        borderRadius="full"
      />

      <AspectRatio height="100%" objectFit="contain">
        <video src={videoUrl} autoPlay muted loop />
      </AspectRatio>
      <DiscardModal discardPost={discardPost} />
    </Flex>
  );
};

const UploadSelectedFile = ({ handleUpload }: UploadSelectedFileProps) => {
  const toast = useToast();

  const getVideoDuration = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const media = new Audio(reader.result as string);
      media.onloadeddata = () => {
        const duration = Math.round(media.duration);
        if (duration > 180) {
          toast({
            position: "top",
            description: "Video is over the 3 minute limit",
            duration: 3000,
          });
        } else {
          handleUpload(file);
        }
      };
    };
    reader.readAsDataURL(file);
  };

  const { dropRef, inputRef, selectFile, selectedFile } =
    useDragAndDrop(getVideoDuration);

  return (
    <Flex
      onClick={selectFile}
      ref={dropRef}
      flexDir="column"
      justify="center"
      height="500px"
      bg="gray.100"
      _hover={{ bg: "gray.200" }}
      borderRadius="10px"
      marginTop="10px"
      cursor="pointer"
      width="320px"
    >
      <Center>
        <MdOutlineCloudUpload size={70} fill="gray" />
      </Center>

      <Text color="gray.600" textAlign="center" fontSize="xl" marginTop="10px">
        Select video to upload
      </Text>
      <Text color="gray.600" textAlign="center" margin="10px 0">
        Or drag and drop a file
      </Text>
      <Center>
        <Box color="gray.600" fontSize="sm">
          <Text>MP4 or WebM</Text>
          <Text>720x1280 resolution or higher</Text>
          <Text>Up to 180 seconds</Text>
        </Box>
      </Center>
      <input
        onChange={selectedFile}
        ref={inputRef}
        type="file"
        accept="video/mp4,/video/webm"
        id="file-input"
        style={{ opacity: 0, cursor: "pointer" }}
      />
    </Flex>
  );
};

const UploadProgress = ({
  file,
  uploadProgress,
  cancelUpload,
}: UploadProgressProps) => {
  return (
    <Flex
      flexDir="column"
      justify="center"
      height="500px"
      bg="gray.100"
      _hover={{ bg: "gray.200" }}
      borderRadius="10px"
      marginTop="10px"
      width="320px"
      gap="10px"
    >
      <Text color="gray.600" textAlign="center" fontSize="xl" marginTop="10px">
        {file?.name}
      </Text>
      <Flex justifyContent="center">
        <CircularProgress
          value={uploadProgress}
          color="red"
          size="70px"
          marginTop="10px"
        >
          <CircularProgressLabel>{uploadProgress}%</CircularProgressLabel>
        </CircularProgress>
      </Flex>
      <Text textAlign="center" fontSize="sm">
        {file && Math.round(file.size / 1000000)} MB
      </Text>
      <Center>
        <Button
          onClick={cancelUpload}
          colorScheme="red"
          width="30%"
          marginTop="30px"
        >
          Cancel
        </Button>
      </Center>
    </Flex>
  );
};

const UploadForm = ({ discardUpload, videoUrl, user }: UploadFormProps) => {
  const navigate = useNavigate();
  const { openDiscardModal, closeDiscardModal } = useDiscardModal();
  const { openSuccessModal, closeSuccessModal } = useSuccessModal();
  const [caption, setCaption] = useState<ICaption>({
    rawData: null,
    characterLength: 0,
  });
  const [isSubmitting, setSubmitting] = useState(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [isEmpty, setEmpty] = useState(false);
  const toast = useToast();

  function discardPost() {
    discardUpload();
    closeDiscardModal();
    closeSuccessModal();
    setEditorState(() => EditorState.createEmpty());
    setCaption({
      rawData: null,
      characterLength: 0,
    });
  }

  function handleViewProfile() {
    navigate(`/${user?.username}`);
    closeSuccessModal();
  }

  async function onSubmit() {
    if (videoUrl) {
      setSubmitting(true);
      const postId = nanoid();
      const usersCollection = collection(db, "users");
      const userDoc = doc(usersCollection, user?.uid);
      const userPosts = collection(userDoc, "posts");
      await setDoc(doc(userPosts, postId), {
        postId,
        user,
        videoUrl,
        likeCount: 0,
        audioName: `original sound - ${user?.username}`,
        caption: caption.rawData,
        timestamp: serverTimestamp(),
      })
        .then(() => {
          openSuccessModal();
        })
        .catch((error) => {
          console.error(error);
          toast({
            position: "top",
            description: "Post could not be added!",
          });
        })
        .finally(() => {
          setSubmitting(false);
        });
    }
  }

  useEffect(() => {
    if (caption.rawData?.blocks[0].text === "") {
      setEmpty(true);
    } else {
      setEmpty(false);
    }
  }, [caption]);

  return (
    <Flex marginTop="100px" marginLeft="50px" flexDir="column" width="50vw">
      <Flex justifyContent="space-between" marginBottom="5px">
        <Text fontSize="2xl" fontWeight="bold">
          Caption
        </Text>
        <Spacer />
        <Text>{caption.characterLength}/150</Text>
      </Flex>
      <DraftEditor
        editorState={editorState}
        setEditorState={setEditorState}
        onInput={setCaption}
        maxLength={150}
      />
      <Flex justifyContent="flex-end" gap="5px" marginTop="10px">
        <Button
          disabled={isEmpty}
          onClick={openDiscardModal}
          width="150px"
          variant="ghost"
          borderRadius="0"
        >
          Discard
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!videoUrl || isSubmitting}
          width="150px"
          colorScheme="red"
          borderRadius="0"
          focusBorderColor="none"
        >
          Post
        </Button>
      </Flex>
      <DiscardModal discardPost={discardPost} />
      <SuccessModal
        handleConfirm={discardPost}
        handleViewProfile={handleViewProfile}
      />
    </Flex>
  );
};

export default Upload;
