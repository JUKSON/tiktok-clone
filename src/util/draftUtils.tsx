import DOMPurify from "dompurify";
import { EditorState, Modifier } from "draft-js";

export function formatDraftText({ blocks, entityMap }: any) {
  const dirty = blocks[0].text;
  let caption = DOMPurify.sanitize(dirty);

  blocks[0].entityRanges.forEach((range: any) => {
    const { data } = entityMap[range.key];
    const start = caption.slice(0, range.offset);
    const mention = `<a href="/${data.mention.name}">${data.mention.name}</href>`;
    const end = caption.slice(range.offset + range.length);
    caption = `${start}${mention}${end}`;
  });

  return caption;
}

export function insertCharacter(characterToInsert: any, editorState: any) {
  const currentContent = editorState.getCurrentContent();
  const currentSelection = editorState.getSelection();
  const newContent = Modifier.replaceText(
    currentContent,
    currentSelection,
    characterToInsert
  );

  const newEditorState = EditorState.push(
    editorState,
    newContent,
    characterToInsert
  );

  const newEditorStateWithFocus = EditorState.moveFocusToEnd(newEditorState);

  return newEditorStateWithFocus;
}

// caption editor on mention watch
