import { Flex, Box, Text, Center, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Flex justifyContent="center" alignItems="center" height="100vh">
      <Box>
        <Text fontSize="4xl" fontWeight="medium" textAlign="center">
          Page not found
        </Text>
        <Text textAlign="center" color="gray">
          Sorry, the page you tried cannot be found
        </Text>
        <Link to="/">
          <Center marginTop="10px">
            <Button width="50%" colorScheme="red">
              Back Home
            </Button>
          </Center>
        </Link>
      </Box>
    </Flex>
  );
};

export default NotFound;
