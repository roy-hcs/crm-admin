import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND } from 'lexical';

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

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
    </div>
  );
}
