import { PostData } from "pages/Feed";
import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import defaultIcon from "assets/default.png";
import { formatDraftText } from "util/draftUtils";
import { IoMusicalNotesSharp } from "react-icons/io5";
import { FaShare } from "react-icons/fa";
import {
  BsPlayFill,
  BsPauseFill,
  BsVolumeUp,
  BsVolumeMute,
} from "react-icons/bs";
import useVideo from "hooks/useVideo";
import { useEffect } from "react";
import LikeButton from "./LikeButton";
import MessageButton from "./MessageButton";
import FollowButton from "./FollowButton";
import { Link } from "react-router-dom";

interface FeedItemProps {
  post: PostData;
}

const FeedItem = ({ post }: FeedItemProps) => {
  return (
    <Flex flexDir="column" marginTop="10px">
      <Flex marginBottom="10px">
        <Link to={`/${post.user.username}`}>
          <Image
            src={post.user.photoURL}
            fallbackSrc={defaultIcon}
            boxSize="50px"
            borderRadius="full"
            margin="10px"
          />
        </Link>
        <Flex flexDir="column" width="450px">
          <Link to={`/${post.user.username}`}>
            <Flex gap="5px" alignItems="center">
              <Text fontWeight="semibold">{post.user.username}</Text>
              <Text fontSize="sm">{post.user.displayName}</Text>
            </Flex>
          </Link>
          <Text
            dangerouslySetInnerHTML={{
              __html: formatDraftText(post.caption),
            }}
          />
          <Flex alignItems="center" gap="5px">
            <IoMusicalNotesSharp />
            <Text fontWeight="semibold">{post.audioName}</Text>
          </Flex>
        </Flex>
        <FollowButton post={post} />
      </Flex>
      <Flex marginBottom="15px" marginLeft="60px">
        <FeedItemVideo post={post} />
      </Flex>
      <hr />
    </Flex>
  );
};

const FeedItemVideo = ({ post }: FeedItemProps) => {
  const {
    videoRef,
    isPlaying,
    setPlaying,
    isMuted,
    toggleMute,
    togglePlay,
    setMuted,
  } = useVideo();

  useEffect(() => {
    const options = {
      rootMargin: "0px",
      threshold: [0.9, 1],
    };

    function playVideo(entries: IntersectionObserverEntry[]) {
      entries.forEach((entry) => {
        if (videoRef && videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.play();
            setPlaying(true);
          } else {
            videoRef.current.pause();
            setPlaying(false);
            setMuted(true);
          }
        }
      });
    }

    const observer = new IntersectionObserver(playVideo, options);
    observer.observe(videoRef.current!);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Flex>
      <Box width="260px" height="465px">
        <video
          ref={videoRef}
          style={{ borderRadius: "6px" }}
          src={post.videoUrl}
          playsInline
          loop
          muted={isMuted}
        />
        <Box
          onClick={togglePlay}
          position="relative"
          bottom="35px"
          marginLeft="10px"
          cursor="pointer"
        >
          {isPlaying ? (
            <BsPauseFill color="white" size={30} />
          ) : (
            <BsPlayFill color="white" size={30} />
          )}
        </Box>
        <Box
          onClick={toggleMute}
          position="relative"
          bottom="72px"
          marginLeft="220px"
          cursor="pointer"
        >
          {isMuted ? (
            <BsVolumeMute color="white" size={30} />
          ) : (
            <BsVolumeUp color="white" size={30} />
          )}
        </Box>
      </Box>
      <Flex flexDir="column-reverse" marginLeft="10px">
        <Box as="button" display="flex" flexDir="column" alignItems="center">
          <Flex
            bg="gray.300"
            borderRadius="full"
            width="35px"
            height="35px"
            justifyContent="center"
            alignItems="center"
          >
            <FaShare size={18} />
          </Flex>
        </Box>
        <MessageButton post={post} />
        <LikeButton post={post} />
      </Flex>
    </Flex>
  );
};

export default FeedItem;
