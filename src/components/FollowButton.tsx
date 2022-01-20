import { Button } from "@chakra-ui/react";
import useUser from "context/userContext";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { PostData } from "pages/Feed";
import { useDocument } from "react-firebase-hooks/firestore";

interface FollowButtonProps {
  post: PostData;
}

const FollowButton = ({ post }: FollowButtonProps) => {
  const { user } = useUser();
  if (!user) {
    throw Error("No user");
  }

  const followingCol = collection(user.ref, "following");
  const followingDoc = doc(followingCol, post?.user.uid);

  const followerCol = collection(post.user.ref, "followers");
  const followerDoc = doc(followerCol, user.uid);

  const [isFollowing] = useDocument(followingDoc);

  const addFollow = async () => {
    await setDoc(followingDoc, post?.user);
    await setDoc(followerDoc, user);
  };

  const removeFollow = async () => {
    await deleteDoc(followingDoc);
    await deleteDoc(followerDoc);
  };

  return (
    <>
      {isFollowing?.exists() ? (
        <Button
          onClick={removeFollow}
          variant="outline"
          colorScheme="red"
          height="30px"
          width="88px"
        >
          Unfollow
        </Button>
      ) : (
        <Button
          onClick={addFollow}
          variant="outline"
          colorScheme="red"
          height="30px"
          width="88px"
        >
          Follow
        </Button>
      )}
    </>
  );
};

export default FollowButton;
