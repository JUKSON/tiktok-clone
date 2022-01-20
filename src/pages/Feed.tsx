import { Box, Flex } from "@chakra-ui/react";
import FeedItem from "components/FeedItem";
import Sidebar from "components/Sidebar";
import { IUser } from "context/userContext";
import { RawDraftContentState } from "draft-js";
import {
  collectionGroup,
  DocumentData,
  DocumentReference,
  query,
  Timestamp,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "util/firebase";

export interface PostData {
  id: string;
  ref: DocumentReference<DocumentData>;
  audioName: string;
  caption: RawDraftContentState;
  likeCount: number;
  postId: string;
  timestamp: Timestamp;
  user: IUser;
  videoUrl: string;
}

const Feed = () => {
  return (
    <Flex marginTop="90px" gap="150px">
      <Sidebar />
      <FeedList />
    </Flex>
  );
};

const FeedList = () => {
  const q = query(collectionGroup(db, "posts"));
  const [postsCollection] = useCollection(q);

  const posts: PostData[] | undefined = postsCollection?.docs.map((doc) => {
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

  return (
    <Box>
      {posts?.map((post) => {
        return <FeedItem key={post.id} post={post} />;
      })}
    </Box>
  );
};

export default Feed;
