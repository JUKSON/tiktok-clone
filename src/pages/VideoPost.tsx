import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import {
  addDoc,
  collection,
  collectionGroup,
  DocumentData,
  DocumentReference,
  limit,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "util/firebase";
import defaultIcon from "assets/default.png";
import useVideo from "hooks/useVideo";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BsVolumeUp, BsVolumeMute } from "react-icons/bs";
import { IoMusicalNotesSharp } from "react-icons/io5";
import { formatDraftText } from "util/draftUtils";
import { PostData } from "./Feed";
import { useCollection } from "react-firebase-hooks/firestore";
import Loading from "components/Loading";
import LikeButton from "components/LikeButton";
import MessageButton from "components/MessageButton";
import FollowButton from "components/FollowButton";
import { EditorState, RawDraftContentState } from "draft-js";
import { ICaption } from "./Upload";
import DraftEditor from "components/DraftEditor";
import useUser from "context/userContext";
import type { IUser } from "context/userContext";

interface VideoPostProps {
  post: PostData | undefined;
}

interface VideoPostCommentProps {
  comment: CommentData;
}

export interface CommentData {
  id: string;
  ref: DocumentReference<DocumentData>;
  text: RawDraftContentState;
  user: IUser;
}

const VidePost = () => {
  const { postId } = useParams();
  const q = query(
    collectionGroup(db, "posts"),
    where("postId", "==", postId),
    limit(1)
  );
  const [postsCollection, loading] = useCollection(q);

  const postDoc: PostData[] | undefined = postsCollection?.docs.map((doc) => {
    return {
      id: doc.id,
      ref: doc.ref,
      audioName: doc.data().audioName,
      caption: doc.data().caption,
      likeCount: doc.data().likeCount,
      postId: doc.data().postId,
      timestamp: doc.data().timestamp,
      user: doc.data().user,
      videoUrl: doc.data().videoUrl,
    };
  });

  const post = postDoc?.[0];

  if (loading) {
    return <Loading />;
  }

  return (
    <Flex marginTop="70px" height="92vh">
      <Flex bg="black" width="65%" justifyContent="center" position="relative">
        <VideoPostPlayer post={post} />
      </Flex>
      <Flex>
        <VideoPostInfo post={post} />
      </Flex>
    </Flex>
  );
};

const VideoPostPlayer = ({ post }: VideoPostProps) => {
  const { videoRef, isMuted, toggleMute } = useVideo();
  const navigate = useNavigate();

  return (
    <Flex>
      <Box
        onClick={() => navigate(-1)}
        position="absolute"
        left="10px"
        top="10px"
        color="whiteAlpha.700"
        cursor="pointer"
      >
        <AiOutlineCloseCircle size={40} />
      </Box>
      <Flex alignItems="center">
        <video
          src={post?.videoUrl}
          style={{ height: "90vh" }}
          muted={isMuted}
          autoPlay
          loop
          ref={videoRef}
        />
      </Flex>
      <Box
        position="absolute"
        right="10px"
        bottom="10px"
        color="whiteAlpha.700"
        cursor="pointer"
      >
        {isMuted ? (
          <BsVolumeMute onClick={toggleMute} size={40} />
        ) : (
          <BsVolumeUp onClick={toggleMute} size={40} />
        )}
      </Box>
    </Flex>
  );
};

const VideoPostInfo = ({ post }: VideoPostProps) => {
  const transformDate = () => {
    if (post) {
      const date = new Date(post.timestamp.toDate());
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      return `${day}.${month + 1}.${year}`;
    }
  };

  return (
    <Flex marginTop="20px" marginLeft="20px">
      <Flex flexDir="column" height="60px" width="400px">
        <Flex alignItems="center" marginBottom="20px">
          <Link to={`/${post?.user.username}`}>
            <Image
              src={post?.user.photoURL}
              fallbackSrc={defaultIcon}
              boxSize="40px"
              margin="5px"
              borderRadius="full"
            />
          </Link>
          <Link to={`/${post?.user.username}`}>
            <Flex flexDir="column" justifyContent="center">
              <Text fontWeight="semibold">{post?.user.username}</Text>
              <Flex gap="5px">
                <Text fontSize="sm">{post?.user.displayName}</Text>
                <Box as="span" fontSize="sm">
                  ·
                </Box>
                <Text color="gray.500" fontSize="sm">
                  {transformDate()}
                </Text>
              </Flex>
            </Flex>
          </Link>
        </Flex>

        <Text
          dangerouslySetInnerHTML={{
            __html: formatDraftText(post?.caption),
          }}
          marginBottom="20px"
        />
        <Flex marginBottom="20px" alignItems="center" gap="5px">
          <IoMusicalNotesSharp />
          <Text>{post?.audioName}</Text>
        </Flex>
        <Flex gap="10px">
          <LikeButton post={post!} />
          <MessageButton post={post!} />
        </Flex>
        <Flex marginTop="10px">
          <VideoPostComments post={post} />
        </Flex>
        <VideoPostCommentForm post={post} />
      </Flex>
      <FollowButton post={post!} />
    </Flex>
  );
};

const VideoPostComments = ({ post }: VideoPostProps) => {
  const q = query(collection(post?.ref!, "comments"));
  const [commentsCollection] = useCollection(q);

  const comments: CommentData[] | undefined = commentsCollection?.docs.map(
    (doc) => {
      return {
        id: doc.id,
        ref: doc.ref,
        user: doc.data().user,
        text: doc.data().text,
      };
    }
  );

  return (
    <Flex>
      <Box>
        {comments?.map((comment) => {
          return <VideoPostComment key={comment.id} comment={comment} />;
        })}
      </Box>
    </Flex>
  );
};

const VideoPostComment = ({ comment }: VideoPostCommentProps) => {
  return (
    <Flex marginBottom="10px">
      <Flex gap="5px">
        <Flex>
          <Image
            src={comment.user.photoURL}
            alt={comment.user.username}
            fallbackSrc={defaultIcon}
            boxSize="30px"
            margin="5px"
            borderRadius="full"
          />
        </Flex>
        <Flex flexDir="column">
          <Link to={`/${comment.user.username}`}>
            <Text fontWeight="bold" fontSize="small">
              {comment.user.username}
            </Text>
          </Link>
          <Text
            fontSize="smaller"
            dangerouslySetInnerHTML={{ __html: formatDraftText(comment.text) }}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

const VideoPostCommentForm = ({ post }: VideoPostProps) => {
  const { user } = useUser();

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [comment, setComment] = useState<ICaption>({
    rawData: null,
    characterLength: 0,
  });

  const addComment = async () => {
    const newComment = {
      text: comment.rawData,
      user,
      createdAt: serverTimestamp(),
    };
    if (post) {
      await addDoc(collection(post.ref, "comments"), newComment);
      setEditorState(EditorState.createEmpty());
    }
  };

  return (
    <Flex alignItems="center" marginTop="10px" gap="10px">
      <Box width="400px">
        <DraftEditor
          editorState={editorState}
          setEditorState={setEditorState}
          onInput={setComment}
          maxLength={150}
        />
      </Box>
      <Button
        onClick={addComment}
        variant="ghost"
        size="md"
        _hover={{ bg: "none" }}
      >
        Post
      </Button>
    </Flex>
  );
};

export default VidePost;
