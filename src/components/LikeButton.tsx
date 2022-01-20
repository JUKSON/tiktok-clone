import { Box, Flex, Text } from "@chakra-ui/react";
import useUser from "context/userContext";
import {
  collection,
  deleteDoc,
  doc,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { PostData } from "pages/Feed";
import { useDocument } from "react-firebase-hooks/firestore";
import { AiFillHeart } from "react-icons/ai";

interface LikeButtonProps {
  post: PostData;
}

const LikeButton = ({ post }: LikeButtonProps) => {
  const { user } = useUser();
  if (!user) {
    throw Error("No user");
  }

  const likesColRef = collection(post.ref, "likes");
  const likesDocRef = doc(likesColRef, user?.uid);
  const [likesDoc] = useDocument(likesDocRef);

  const likedPostsCol = collection(user.ref, "likedPosts");
  const likedPostsDoc = doc(likedPostsCol, post.id);

  const addLike = async () => {
    await updateDoc(post.ref, {
      likeCount: increment(1),
    });
    await setDoc(likesDocRef, {
      uid: user?.uid,
    });
    await setDoc(likedPostsDoc, post);
  };

  const removeLike = async () => {
    await updateDoc(post.ref, {
      likeCount: increment(-1),
    });
    await deleteDoc(likesDocRef);
    await deleteDoc(likedPostsDoc);
  };

  return (
    <Box as="button" display="flex" flexDir="column" alignItems="center">
      <Flex
        bg="gray.300"
        borderRadius="full"
        width="35px"
        height="35px"
        justifyContent="center"
        alignItems="center"
      >
        {likesDoc?.exists() ? (
          <AiFillHeart color="red" size={18} onClick={removeLike} />
        ) : (
          <AiFillHeart size={18} onClick={addLike} />
        )}
      </Flex>
      <Text>{post.likeCount}</Text>
    </Box>
  );
};

export default LikeButton;
