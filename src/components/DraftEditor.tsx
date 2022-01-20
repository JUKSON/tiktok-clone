import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import Editor from "@draft-js-plugins/editor";
import { MentionData } from "@draft-js-plugins/mention";
import { convertToRaw, DraftHandleValue, EditorState } from "draft-js";
import createMentionPlugin, {
  defaultSuggestionsFilter,
  MentionPluginTheme,
} from "@draft-js-plugins/mention";
import type { ICaption } from "pages/Upload";
import defaultIcon from "assets/default.png";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, query } from "firebase/firestore";
import { db } from "util/firebase";
import "draft-js/dist/Draft.css";

interface DraftEditorProps {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
  onInput: React.Dispatch<React.SetStateAction<ICaption>>;
  maxLength: number;
}

interface OnSearchChangeProps {
  trigger: string;
  value: string;
}

interface EntryProps {
  className?: string;
  role: string;
  id: string;
  theme?: MentionPluginTheme;
  mention: MentionData;
  isFocused: boolean;
  searchValue?: string;
}

export default function DraftEditor({
  editorState,
  setEditorState,
  onInput,
  maxLength,
}: DraftEditorProps) {
  const { plugins, MentionSuggestions } = useMemo(() => {
    const mentionPlugin = createMentionPlugin();
    const { MentionSuggestions } = mentionPlugin;
    const plugins = [mentionPlugin];
    return { plugins, MentionSuggestions };
  }, []);
  const editorRef = useRef<Editor>(null);
  const usersRef = collection(db, "users");
  const q = query(usersRef);
  const [usersCollection] = useCollectionData(q);
  const users: any = usersCollection?.map((user) => {
    return {
      ...user,
      name: user.username,
    };
  });

  const [suggestions, setSuggestions] = useState(users?.slice(0, 5));
  const [isOpen, setOpen] = useState(false);

  function onSearchChange({ value }: OnSearchChangeProps) {
    setSuggestions(defaultSuggestionsFilter(value, users));
  }

  function handleBeforeInput(
    chars: string,
    editorState: EditorState,
    eventTimeStamp: number
  ): DraftHandleValue {
    const currentContent = editorState.getCurrentContent();
    const currentContentLength = currentContent.getPlainText().length;

    if (currentContentLength > maxLength - 1) {
      // myb make it a toast? chakra
      console.log(`You can type max ${maxLength} characters`);
      return "handled";
    }
    return "not-handled";
  }

  function handlePastedText(
    pastedText: string,
    html: string | undefined,
    editorState: EditorState
  ): DraftHandleValue {
    const contentState = editorState.getCurrentContent();
    const characterLength = contentState.getPlainText().length;

    if (characterLength + pastedText.length > maxLength) {
      console.log(`You can type max ${maxLength} characters`);
      return "handled";
    }
    return "not-handled";
  }

  useEffect(() => {
    const contentState = editorState.getCurrentContent();
    const characterLength = contentState.getPlainText().length;
    const rawData = convertToRaw(contentState);
    onInput({ rawData, characterLength });
  }, [editorState, onInput]);

  return (
    <Flex
      onClick={() => editorRef.current?.focus()}
      border="1px"
      minHeight="37px"
      borderColor="gray.300"
      borderRadius="6px"
      cursor="text"
      boxSizing="border-box"
      wordBreak="break-all"
    >
      <Box margin="10px" maxHeight="full" width="50vw" fontWeight="semibold">
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={setEditorState}
          plugins={plugins}
          handleBeforeInput={handleBeforeInput}
          handlePastedText={handlePastedText}
          placeholder="Example: @john hello"
        />
      </Box>
      <MentionSuggestions
        open={isOpen}
        onOpenChange={(open) => setOpen(open)}
        entryComponent={Entry}
        suggestions={suggestions || []}
        onSearchChange={onSearchChange}
      />
    </Flex>
  );
}

function Entry(props: EntryProps) {
  const { mention, theme, searchValue, isFocused, ...parentProps } = props;

  // entry doesnt recognize some att, like usernames and so on
  // https://www.draft-js-plugins.com/plugin/mention mention css
  return (
    <Box {...parentProps}>
      <Flex
        bg="white"
        height="80px"
        alignItems="center"
        width="230px"
        cursor="pointer"
      >
        <Flex bg="blue.100" width="100%" height="75%">
          <Image
            src={mention.photoURL}
            fallbackSrc={defaultIcon}
            borderRadius="full"
            boxSize="40px"
            margin="10px"
          />
          <Flex flexDir="column" marginTop="5px">
            <Text fontWeight="semibold">{mention.name}</Text>
            <Text fontSize="sm">{mention.displayName}</Text>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
