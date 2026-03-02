import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
} from 'lexical';
import { $createHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const applyBlock = (type: 'paragraph' | 'h1' | 'h2') => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      if (type === 'paragraph') {
        (
          $setBlocksType as unknown as (
            selection: unknown,
            createElementNode: () => unknown,
          ) => void
        )(selection, () => $createParagraphNode());
      } else {
        (
          $setBlocksType as unknown as (
            selection: unknown,
            createElementNode: () => unknown,
          ) => void
        )(selection, () => $createHeadingNode(type));
      }
    });
  };

  return (
    <div className="mb-1 flex flex-wrap gap-1 border-b pb-1 text-sm">
      <button type="button" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}>
        B
      </button>
      <button type="button" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}>
        I
      </button>
      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
      >
        U
      </button>

      <button type="button" onClick={() => applyBlock('paragraph')}>
        普通
      </button>
      <button type="button" onClick={() => applyBlock('h1')}>
        H1
      </button>
      <button type="button" onClick={() => applyBlock('h2')}>
        H2
      </button>

      <button
        type="button"
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
      >
        • 列表
      </button>
      <button
        type="button"
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
      >
        1. 列表
      </button>
      <button type="button" onClick={() => editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)}>
        取消列表
      </button>
    </div>
  );
}
