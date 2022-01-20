import {
  Box,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineCloudUpload } from "react-icons/md";
import { MdInbox } from "react-icons/md";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import defaultIcon from "assets/default.png";
import tiktokLogo from "assets/tiktok-logo.svg";
import SearchBar from "./SearchBar";
import useUser from "context/userContext";
import { AiOutlineUser } from "react-icons/ai";
import { IoLogOutOutline } from "react-icons/io5";
import { signOut } from "firebase/auth";
import { auth } from "util/firebase";

const Header = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const logOut = async () => {
    await signOut(auth);
    window.location.reload();
  };

  return (
    <Flex
      bg="white"
      w="100vw"
      position="fixed"
      borderBottom="1px"
      borderBottomColor="gray.300"
      height="70px"
      top="0"
      justifyContent="space-between"
      zIndex="99999"
    >
      <Flex width="130px" marginLeft="120px" alignItems="center">
        <Link to="/">
          <Image src={tiktokLogo} />
        </Link>
      </Flex>
      <Flex alignItems="center">
        <Box width="25vw">
          <SearchBar />
        </Box>
      </Flex>
      <Flex marginRight="120px" alignItems="center">
        <Link to="/upload">
          <MdOutlineCloudUpload style={{ margin: "10px" }} size={30} />
        </Link>
        <IoChatboxEllipsesOutline style={{ margin: "10px" }} size={30} />
        <MdInbox style={{ margin: "10px" }} size={30} />
        <Menu>
          <MenuButton as="button">
            <Image
              src={user.photoURL}
              alt={user.username}
              borderRadius="full"
              boxSize="40px"
              margin="10px"
              cursor="pointer"
              fallbackSrc={defaultIcon}
            />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => navigate(`/${user.username}`)}>
              <AiOutlineUser size={30} />
              <Text marginLeft="12px">View profile</Text>
            </MenuItem>
            <MenuItem onClick={logOut}>
              <IoLogOutOutline size={30} />
              <Text marginLeft="12px">Log out</Text>
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Header;
