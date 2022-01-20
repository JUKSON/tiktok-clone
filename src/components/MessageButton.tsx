import { Box, Flex, Text } from "@chakra-ui/react";
import { collection, query } from "firebase/firestore";
import { PostData } from "pages/Feed";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { BsFillChatDotsFill } from "react-icons/bs";
import { Link } from "react-router-dom";

interface MessageButtonProps {
  post: PostData;
}

const MessageButton = ({ post }: MessageButtonProps) => {
  const q = query(collection(post.ref, "comments"));
  const [comments] = useCollectionData(q);

  return (
    <Box as="button" display="flex" flexDir="column" alignItems="center">
      <Link to={`/${post.user.username}/video/${post.id}`}>
        <Flex
          bg="gray.300"
          borderRadius="full"
          width="35px"
          height="35px"
          justifyContent="center"
          alignItems="center"
        >
          <BsFillChatDotsFill size={18} />
        </Flex>
      </Link>
      <Text>{comments?.length}</Text>
    </Box>
  );
};

export default MessageButton;
