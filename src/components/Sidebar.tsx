import { Flex, Image, Text } from "@chakra-ui/react";
import defaultIcon from "assets/default.png";
import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";
import { RiLiveLine } from "react-icons/ri";
import useUser, { IUser } from "context/userContext";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, doc, query, where } from "firebase/firestore";
import { db } from "util/firebase";

interface SidebarProps {
  user: IUser;
}

const Sidebar = () => {
  return (
    <Flex flexDir="column" marginLeft="100px" width="300px">
      <SidebarLinks />
      <hr />
      <SidebarSuggested />
      <SidebarFollowing />
    </Flex>
  );
};

const SidebarLinks = () => {
  return (
    <>
      <Link to="/">
        <Flex
          flexDir="row"
          gap="10px"
          marginBottom="10px"
          _hover={{ bg: "gray.100" }}
          padding="10px"
          borderRadius="5px"
        >
          <AiFillHome size={30} color="red" />
          <Text color="red" fontSize="xl" fontWeight="bold">
            For you
          </Text>
        </Flex>
      </Link>
      <Link to="/">
        <Flex
          flexDir="row"
          gap="10px"
          marginBottom="10px"
          _hover={{ bg: "gray.100" }}
          padding="10px"
          borderRadius="5px"
        >
          <BsPeople size={30} />
          <Text fontSize="xl" fontWeight="bold">
            Following
          </Text>
        </Flex>
      </Link>
      <Link to="/">
        <Flex
          flexDir="row"
          gap="10px"
          marginBottom="10px"
          _hover={{ bg: "gray.100" }}
          padding="10px"
          borderRadius="5px"
        >
          <RiLiveLine size={30} />
          <Text fontSize="xl" fontWeight="bold">
            LIVE
          </Text>
        </Flex>
      </Link>
    </>
  );
};

const SidebarSuggested = () => {
  const { user } = useUser();
  const q = query(collection(db, "users"), where("uid", "!=", user?.uid));
  const [suggestedCollection, loading] = useCollection(q);

  const suggested: IUser[] | undefined = suggestedCollection?.docs.map(
    (doc) => {
      return {
        id: doc.id,
        ref: doc.ref,
        uid: doc.data().uid,
        username: doc.data().username,
        displayName: doc.data().displayName,
        photoURL: doc.data().photoURL,
      };
    }
  );

  if (loading || suggestedCollection?.empty) {
    return null;
  }

  return (
    <Flex
      flexDir="column"
      marginTop="15px"
      overflowY="scroll"
      height="150px"
      sx={{
        "&::-webkit-scrollbar": {
          width: "5px",
          borderRadius: "8px",
          backgroundColor: `rgba(0, 0, 0, 0.05)`,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: `rgba(0, 0, 0, 0.05)`,
        },
      }}
    >
      <Text fontSize="md" color="gray.500">
        Suggested accounts
      </Text>
      {suggested?.map((user) => {
        return <SidebarItem key={user.id} user={user} />;
      })}
    </Flex>
  );
};

const SidebarFollowing = () => {
  const { user } = useUser();
  const usersCollection = collection(db, "users");
  const userDoc = doc(usersCollection, user?.uid);
  const userFollowing = collection(userDoc, "following");
  const q = query(userFollowing);
  const [followingCollection, loading] = useCollection(q);

  const following: IUser[] | undefined = followingCollection?.docs.map(
    (doc) => {
      return {
        id: doc.id,
        ref: doc.ref,
        uid: doc.data().uid,
        username: doc.data().username,
        displayName: doc.data().displayName,
        photoURL: doc.data().photoURL,
      };
    }
  );

  if (loading || followingCollection?.empty) {
    return null;
  }

  return (
    <Flex
      flexDir="column"
      marginTop="15px"
      overflowY="scroll"
      height="150px"
      sx={{
        "&::-webkit-scrollbar": {
          width: "5px",
          borderRadius: "8px",
          backgroundColor: `rgba(0, 0, 0, 0.05)`,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: `rgba(0, 0, 0, 0.05)`,
        },
      }}
    >
      <Text fontSize="md" color="gray.500">
        Following
      </Text>
      {following?.map((user) => {
        return <SidebarItem key={user.id} user={user} />;
      })}
    </Flex>
  );
};

const SidebarItem = ({ user }: SidebarProps) => {
  return (
    <Link to={`/${user.username}`}>
      <Flex
        margin="10px 0"
        width="290px"
        _hover={{ bg: "gray.100" }}
        cursor="pointer"
        borderRadius="5px"
      >
        <Image
          src={user.photoURL}
          fallbackSrc={defaultIcon}
          alt={user.username}
          boxSize="35px"
          margin="5px"
          borderRadius="full"
        />
        <Flex flexDir="column" marginLeft="10px">
          <Text fontWeight="semibold">{user.username}</Text>
          <Text fontWeight="semibold" fontSize="sm" color="gray.700">
            {user.displayName}
          </Text>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Sidebar;
