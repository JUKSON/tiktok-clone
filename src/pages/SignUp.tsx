import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "util/firebase";
import { removeWhiteSpace } from "util/removeWhiteSpace";
import { debounce } from "lodash";
import { useToast } from "@chakra-ui/react";

interface SignUpProps {
  user: User | null;
}

const SignUp = ({ user }: SignUpProps) => {
  const [isTaken, setTaken] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setLoading] = useState(false);

  const toast = useToast();

  const signUp = async (event: React.FormEvent) => {
    event.preventDefault();

    if (username.length < 4) {
      return toast({
        position: "top",
        description: "This username is under the 4 characters limit",
        duration: 2000,
      });
    } else if (username.length > 24) {
      return toast({
        position: "top",
        description: "This username is over the 24 characters limit",
        duration: 2000,
      });
    }

    if (!user) {
      throw new Error("User does not exists");
    }
    const { uid, displayName, photoURL } = user;
    const displayUsername = `@${removeWhiteSpace(username)}`;

    try {
      setLoading(true);
      await setDoc(doc(db, `users/${uid}`), {
        uid,
        username: displayUsername,
        displayName,
        photoURL,
      });
      await setDoc(doc(db, `usernames/${displayUsername}`), { uid });
      window.location.reload();
    } catch (error) {
      setLoading(false);
      console.error("There was an error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      console.log("User authenticated", user);
      const defaultUsername = removeWhiteSpace(user.displayName);
      setUsername(defaultUsername);
    }
  }, [user]);

  useEffect(() => {
    const cleanUsername = removeWhiteSpace(username);

    const checkUsername = debounce(async () => {
      if (cleanUsername.length >= 4 && cleanUsername.length <= 24) {
        const usernamesRef = doc(db, `usernames/@${cleanUsername}`);
        const usernamesSnap = await getDoc(usernamesRef);
        setTaken(usernamesSnap.exists());
      }
    }, 300);

    if (cleanUsername) {
      checkUsername();
    }
  }, [username]);

  return (
    <Flex justifyContent="center" height="100vh" marginTop="150px">
      <Flex flexDir="column" w="350px" gap="10px">
        <Text
          fontSize="3xl"
          textAlign="center"
          fontWeight="medium"
          marginBottom="10px"
        >
          Sign up
        </Text>
        <form onSubmit={signUp}>
          <FormControl>
            <FormLabel>Create username</FormLabel>
            <Input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              id="username"
              type="text"
              placeholder="Username"
              isInvalid={isTaken}
              errorBorderColor="red.300"
              autoComplete="off"
            />
            <FormHelperText>
              {isTaken
                ? "This username is taken"
                : "You can always change this later"}
            </FormHelperText>
            <Button
              isDisabled={isTaken || isLoading}
              type="submit"
              marginTop="10px"
              w="100%"
              colorScheme="blue"
            >
              Sign up
            </Button>
          </FormControl>
        </form>
      </Flex>
    </Flex>
  );
};

export default SignUp;
