import {
  Flex,
  FormControl,
  Image,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
} from "@chakra-ui/react";
import {
  collection,
  DocumentData,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { db } from "util/firebase";
import defaultIcon from "assets/default.png";
import { Link, useLocation } from "react-router-dom";

interface SearchResultsProps {
  results: DocumentData[];
  search: string;
}

interface SearchResultsItemProps {
  result: DocumentData;
}

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [results, setResults] = useState<DocumentData[]>([]);
  const location = useLocation();

  useEffect(() => {
    setResults([]);
    setSearch("");
  }, [location.pathname]);

  useEffect(() => {
    const searchUsers = debounce(async () => {
      try {
        setLoading(true);
        let usersRef = collection(db, "users");

        const q = query(
          usersRef,
          where("username", ">=", `@${search}`),
          where("username", "<", `@${search}\uf8ff`),
          limit(5)
        );

        const result = await getDocs(q);
        const results = result.docs.map((doc) => doc.data());
        setResults(results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 500);

    if (search.trim().length > 0) {
      searchUsers();
    }
  }, [search]);

  return (
    <Flex flexDir="column">
      <form>
        <FormControl>
          <InputGroup>
            <Input
              placeholder="Search users"
              focusBorderColor="none"
              autoComplete="off"
              borderRadius="20px"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <InputRightAddon
              borderRadius="20px"
              bg="white"
              cursor="pointer"
              children={<BsSearch />}
            />
          </InputGroup>
        </FormControl>
      </form>
      <Flex>
        {search && <SearchResults results={results} search={search} />}
      </Flex>
    </Flex>
  );
};

const SearchResults = ({ results, search }: SearchResultsProps) => {
  return (
    <Flex
      bg="gray.100"
      flexDir="column"
      position="absolute"
      width="340px"
      marginTop="5px"
      borderRadius="5px"
      border="1px"
      borderColor="gray.200"
    >
      <Text fontWeight="semibold" color="gray.500" marginLeft="10px">
        Accounts
      </Text>
      {results.map((result) => {
        return <SearchResultsItem key={result.uid} result={result} />;
      })}
      <Text fontWeight="semibold" marginLeft="10px">
        View all results for "{search}"
      </Text>
    </Flex>
  );
};

const SearchResultsItem = ({ result }: SearchResultsItemProps) => {
  return (
    <Link to={`/${result.username}`}>
      <Flex margin="10px" alignItems="center">
        <Image
          src={result.photoURL}
          fallbackSrc={defaultIcon}
          boxSize="40px"
          borderRadius="full"
        />
        <Flex flexDir="column" marginLeft="5px">
          <Text fontWeight="semibold">{result.username}</Text>
          <Text>{result.displayName}</Text>
        </Flex>
      </Flex>
    </Link>
  );
};

export default SearchBar;
