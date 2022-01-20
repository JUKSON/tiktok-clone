import { Box, Flex, Image, Text } from "@chakra-ui/react";
import defaultImage from "assets/default.png";
import googleImage from "assets/google.svg";
import facebookImage from "assets/facebook.png";
import twitterImage from "assets/twitter.png";
import { signInWithPopup } from "firebase/auth";
import { auth, db, provider } from "util/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";

interface ILogInProps {
  setNewUser: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<FirebaseUser | null>>;
}

const LogIn = ({ setNewUser, setUser }: ILogInProps) => {
  const signIn = async () => {
    const data = await signInWithPopup(auth, provider);

    if (data) {
      await checkUsername(data.user.uid);
      setUser(data.user);
    }
  };

  const checkUsername = async (uid: string) => {
    const q = query(collection(db, "usernames"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    setNewUser(querySnapshot.empty);
  };

  return (
    <Flex justifyContent="center" marginTop="80px">
      <Flex flexDir="column" w="350px" gap="10px">
        <Text
          fontSize="3xl"
          textAlign="center"
          fontWeight="medium"
          marginBottom="50px"
        >
          Sign up for Tiktok
        </Text>
        <Flex cursor="pointer">
          <Box border="1px" borderColor="gray.300" p="5px">
            <Image src={defaultImage} boxSize="50px" />
          </Box>
          <Box
            flexGrow={1}
            border="1px"
            borderColor="gray.300"
            p="5px"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Text fontSize="lg">Use phone or email</Text>
          </Box>
        </Flex>
        <Flex cursor="pointer" onClick={signIn}>
          <Box border="1px" borderColor="gray.300" p="5px">
            <Image src={googleImage} boxSize="50px" />
          </Box>
          <Box
            flexGrow={1}
            border="1px"
            borderColor="gray.300"
            p="5px"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Text fontSize="lg" textAlign="center">
              Continue with Google
            </Text>
          </Box>
        </Flex>
        <Flex>
          <Box border="1px" borderColor="gray.300" p="5px">
            <Image src={facebookImage} boxSize="50px" />
          </Box>
          <Box
            flexGrow={1}
            border="1px"
            borderColor="gray.300"
            p="5px"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Text fontSize="lg" textAlign="center">
              Continue with Facebook
            </Text>
          </Box>
        </Flex>
        <Flex>
          <Box border="1px" borderColor="gray.300" p="5px">
            <Image src={twitterImage} boxSize="50px" />
          </Box>
          <Box
            flexGrow={1}
            border="1px"
            borderColor="gray.300"
            p="5px"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Text fontSize="lg" textAlign="center">
              Continue with Twitter
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default LogIn;
