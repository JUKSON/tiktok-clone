import { Button } from "@chakra-ui/react";
import useUser, { IUser } from "context/userContext";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";

interface FollowProfileButtonProps {
  profile: IUser;
}

const FollowProfileButton = ({ profile }: FollowProfileButtonProps) => {
  const { user } = useUser();
  if (!user) {
    throw Error("No user");
  }

  const followingColRef = collection(user?.ref, "following");
  const followingDocRef = doc(followingColRef, profile.uid);
  const [isFollowing] = useDocument(followingDocRef);

  const followerColRef = collection(profile.ref, "followers");
  const followerDocRef = doc(followerColRef, user.uid);

  const addFollow = async () => {
    await setDoc(followingDocRef, profile);
    await setDoc(followerDocRef, user);
  };

  const removeFollow = async () => {
    await deleteDoc(followingDocRef);
    await deleteDoc(followerDocRef);
  };

  return (
    <>
      {isFollowing?.exists() ? (
        <Button
          onClick={removeFollow}
          variant="outline"
          colorScheme="red"
          height="40px"
          width="150px"
        >
          Unfollow
        </Button>
      ) : (
        <Button
          onClick={addFollow}
          variant="outline"
          colorScheme="red"
          height="40px"
          width="150px"
        >
          Follow
        </Button>
      )}
    </>
  );
};

export default FollowProfileButton;
