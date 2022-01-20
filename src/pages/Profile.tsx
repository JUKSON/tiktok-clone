import {
  Box,
  Flex,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Loading from "components/Loading";
import Sidebar from "components/Sidebar";
import useUser, { IUser } from "context/userContext";
import {
  collection,
  DocumentData,
  limit,
  orderBy,
  query,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { Link, useParams } from "react-router-dom";
import { db } from "util/firebase";
import NotFound from "./NotFound";
import defaultIcon from "assets/default.png";
import { PostData } from "./Feed";
import useVideo from "hooks/useVideo";
import { AiOutlineHeart } from "react-icons/ai";
import FollowProfileButton from "components/FollowProfileButton";

interface ProfileHeaderProps {
  profile: IUser;
  likedPostsCol: QuerySnapshot<DocumentData> | undefined;
}

interface ProfileTabsProps {
  profile: IUser;
}

interface ProfileVideoPostProps {
  post: PostData;
}

const Profile = () => {
  const { username } = useParams();
  const usersQuery = query(
    collection(db, "users"),
    where("username", "==", username),
    limit(1)
  );
  const [usersCollection, loading] = useCollection(usersQuery);

  let userDoc: IUser[] = [];
  if (usersCollection) {
    userDoc = usersCollection.docs.map((doc) => {
      return {
        id: doc.id,
        ref: doc.ref,
        uid: doc.data().uid,
        username: doc.data().username,
        displayName: doc.data().displayName,
        photoURL: doc.data().photoURL,
      };
    });
  }

  const profile = userDoc?.[0];

  let likedQuery;
  if (profile) {
    likedQuery = query(
      collection(profile.ref, "likedPosts"),
      orderBy("timestamp", "desc")
    );
  }
  const [likedPostsCol] = useCollection(likedQuery);

  if (!loading && usersCollection?.empty) {
    return <NotFound />;
  }
  if (loading) {
    return <Loading />;
  }

  return (
    <Flex marginTop="90px" gap="150px">
      <Sidebar />
      <Flex>
        <Flex flexDir="column" width="700px">
          <ProfileHeader profile={profile} likedPostsCol={likedPostsCol} />
          <ProfileTabs profile={profile} />
        </Flex>
      </Flex>
    </Flex>
  );
};

const ProfileHeader = ({
  profile = {} as IUser,
  likedPostsCol,
}: ProfileHeaderProps) => {
  const [isSame, setSame] = useState(false);

  const followersRef = collection(profile.ref, "followers");
  const followingRef = collection(profile.ref, "following");

  const [followersCol] = useCollection(followersRef);
  const [followingCol] = useCollection(followingRef);

  const { user } = useUser();
  if (!user) {
    throw Error("No user");
  }

  useEffect(() => {
    if (user.uid === profile.uid) {
      setSame(true);
    }
  }, []);

  return (
    <Flex gap="30px">
      <Image
        src={profile?.photoURL}
        alt={profile?.username}
        fallbackSrc={defaultIcon}
        borderRadius="full"
        boxSize="100px"
        margin="5px "
      />
      <Flex flexDir="column" gap="5px">
        <Text fontSize="x-large" fontWeight="bold">
          {profile?.username}
        </Text>
        <Text fontSize="md" fontWeight="semibold">
          {profile?.displayName}
        </Text>
        {isSame || <FollowProfileButton profile={profile} />}
        <Flex gap="10px">
          <Flex gap="5px" alignItems="center">
            <Text fontSize="xl" fontWeight="bold">
              {followingCol?.size}
            </Text>
            <Text fontSize="xl">Following</Text>
          </Flex>
          <Flex gap="5px" alignItems="center">
            <Text fontSize="xl" fontWeight="bold">
              {followersCol?.size}
            </Text>
            <Text fontSize="xl">Followers</Text>
          </Flex>
          <Flex gap="5px" alignItems="center">
            <Text fontSize="xl" fontWeight="bold">
              {likedPostsCol?.size}
            </Text>
            <Text fontSize="xl">Likes</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

const ProfileTabs = ({ profile }: ProfileTabsProps) => {
  const q = query(
    collection(profile.ref, "posts"),
    orderBy("timestamp", "desc")
  );
  const [postsCol] = useCollection(q);
  let posts: PostData[] = [];
  if (postsCol) {
    posts = postsCol.docs.map((doc) => ({
      id: doc.id,
      ref: doc.ref,
      audioName: doc.data().audioName,
      caption: doc.data().caption,
      likeCount: doc.data().likeCount,
      postId: doc.data().postId,
      timestamp: doc.data().timestamp,
      user: doc.data().user,
      videoUrl: doc.data().videoUrl,
    }));
  }

  return (
    <Tabs isFitted>
      <TabList>
        <Tab>Videos</Tab>
      </TabList>
      <TabPanels>
        <TabPanel display="flex" gap="10px">
          {posts.map((post) => (
            <ProfileVideoPost key={post.id} post={post} />
          ))}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

const ProfileVideoPost = ({ post }: ProfileVideoPostProps) => {
  const { videoRef, togglePlay } = useVideo();

  return (
    <Link to={`/${post.user.username}/video/${post.id}`}>
      <Box
        onMouseEnter={togglePlay}
        onMouseLeave={togglePlay}
        position="relative"
      >
        <video
          src={post.videoUrl}
          muted
          loop
          ref={videoRef}
          style={{ height: "300px" }}
        />
        <Flex gap="5px" position="absolute" bottom="5px" left="5px">
          <AiOutlineHeart color="white" size={23} />
          <Text fontWeight="semibold" color="white">
            {post.likeCount}
          </Text>
        </Flex>
      </Box>
    </Link>
  );
};

export default Profile;
