import { RrhButton } from '@/components/common/RrhButton';
import { cn } from '@/lib/utils';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { LinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
  ListItemNode,
  ListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { $patchStyleText, $setBlocksType } from '@lexical/selection';
import { HeadingNode, QuoteNode, $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import {
  $isDecoratorNode,
  $isElementNode,
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  type LexicalEditor,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import {
  Bold,
  ImagePlus,
  Italic,
  Link,
  List as ListIcon,
  ListOrdered,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from 'lucide-react';
import { type MutableRefObject, useEffect, useMemo, useRef } from 'react';
import { ImageNode, $createImageNode } from './ImageNode';

type RrhEditorProps = {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onUploadImage?: (file: File) => Promise<string>;
};

function setEditorHtml(editor: LexicalEditor, html: string) {
  editor.update(() => {
    const root = $getRoot();
    root.clear();

    if (!html) {
      root.append($createParagraphNode());
      return;
    }

    const parser = new DOMParser();
    const dom = parser.parseFromString(html, 'text/html');
    const nodes = $generateNodesFromDOM(editor, dom);
    const validNodes = nodes.filter(node => $isElementNode(node) || $isDecoratorNode(node));

    if (validNodes.length === 0) {
      const plainText = dom.body.textContent?.trim() || '';
      if (plainText) {
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(plainText));
        root.append(paragraph);
        return;
      }

      root.append($createParagraphNode());
      return;
    }

    root.append(...validNodes);
  });
}

function ToolbarPlugin({
  disabled,
  onUploadImage,
}: {
  disabled: boolean;
  onUploadImage?: (file: File) => Promise<string>;
}) {
  const [editor] = useLexicalComposerContext();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const colorInputRef = useRef<HTMLInputElement | null>(null);

  const applyBlock = (block: 'paragraph' | 'h1' | 'h2' | 'quote') => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      if (block === 'paragraph') {
        $setBlocksType(selection, () => $createParagraphNode());
        return;
      }

      if (block === 'quote') {
        $setBlocksType(selection, () => $createQuoteNode());
        return;
      }

      $setBlocksType(selection, () => $createHeadingNode(block));
    });
  };

  const onClickLink = () => {
    if (disabled) return;
    const url = window.prompt('请输入链接 URL');
    if (url === null) return;
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, url.trim() || null);
  };

  const onChooseImage = () => {
    if (!onUploadImage || disabled) return;
    fileInputRef.current?.click();
  };

  const onImageChange: React.ChangeEventHandler<HTMLInputElement> = async e => {
    const file = e.target.files?.[0];
    if (!file || !onUploadImage) return;

    try {
      const url = await onUploadImage(file);
      editor.update(() => {
        const selection = $getSelection();
        const node = $createImageNode({ src: url });
        if ($isRangeSelection(selection)) {
          selection.insertNodes([node, $createTextNode('')]);
        } else {
          $getRoot().append(node);
        }
      });
    } finally {
      e.target.value = '';
    }
  };

  const btnCls = 'h-8 w-8 p-0';

  const clearEditor = () => {
    if (disabled) return;
    editor.update(() => {
      const root = $getRoot();
      root.clear();
      root.append($createParagraphNode());
    });
  };

  const applyTextColor = (color: string) => {
    if (disabled) return;

    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      $patchStyleText(selection, { color });
    });
  };

  return (
    <div className="bg-muted/30 mb-2 flex flex-wrap items-center gap-1 rounded-md border p-2">
      <RrhButton
        type="button"
        variant="outline"
        size="sm"
        className={btnCls}
        disabled={disabled}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
      >
        <Undo2 className="size-4" />
      </RrhButton>
      <RrhButton
        type="button"
        variant="outline"
        size="sm"
        className={btnCls}
        disabled={disabled}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
      >
        <Redo2 className="size-4" />
      </RrhButton>

      <div className="bg-border mx-1 h-5 w-px" />

      <RrhButton
        type="button"
        variant="outline"
        size="sm"
        className={btnCls}
        disabled={disabled}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
      >
        <Bold className="size-4" />
      </RrhButton>
      <RrhButton
        type="button"
        variant="outline"
        size="sm"
        className={btnCls}
        disabled={disabled}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
      >
        <Italic className="size-4" />
      </RrhButton>
      <RrhButton
        type="button"
        variant="outline"
        size="sm"
        className={btnCls}
        disabled={disabled}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
      >
        <Underline className="size-4" />
      </RrhButton>
      <RrhButton
        type="button"
        variant="outline"
        size="sm"
        className={btnCls}
        disabled={disabled}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
      >
        <Strikethrough className="size-4" />
      </RrhButton>

      <div className="bg-border mx-1 h-5 w-px" />

      <RrhButton
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() => applyBlock('paragraph')}
      >
        P
      </RrhButton>
      <RrhButton
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() => applyBlock('h1')}
      >
        H1
      </RrhButton>
      <RrhButton
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() => applyBlock('h2')}
      >
        H2
      </RrhButton>
      <RrhButton
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() => applyBlock('quote')}
      >
        引用
      </RrhButton>

      <div className="bg-border mx-1 h-5 w-px" />

      <RrhButton
        type="button"
        variant="outline"
        size="sm"
        className={btnCls}
        disabled={disabled}
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
      >
        <ListIcon className="size-4" />
      </RrhButton>
      <RrhButton
        type="button"
        variant="outline"
        size="sm"
        className={btnCls}
        disabled={disabled}
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
      >
        <ListOrdered className="size-4" />
      </RrhButton>
      <RrhButton
        type="button"
        variant="outline"
        size="sm"
        className={btnCls}
        disabled={disabled}
        onClick={onClickLink}
      >
        <Link className="size-4" />
      </RrhButton>

      <div className="flex items-center gap-1 rounded-md border px-2 py-1">
        <input
          ref={colorInputRef}
          type="color"
          aria-label="选择文字颜色"
          disabled={disabled}
          className="h-6 w-6 cursor-pointer border-0 bg-transparent p-0 disabled:cursor-not-allowed"
          onChange={e => applyTextColor(e.target.value)}
        />
        <RrhButton
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled}
          onClick={() => applyTextColor('inherit')}
        >
          清色
        </RrhButton>
      </div>

      {onUploadImage && (
        <>
          <RrhButton
            type="button"
            variant="outline"
            size="sm"
            className={btnCls}
            disabled={disabled}
            onClick={onChooseImage}
          >
            <ImagePlus className="size-4" />
          </RrhButton>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onImageChange}
          />
        </>
      )}

      <div className="bg-border mx-1 h-5 w-px" />

      <RrhButton
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={clearEditor}
      >
        清空
      </RrhButton>
    </div>
  );
}

function ValueSyncPlugin({ value, htmlRef }: { value: string; htmlRef: MutableRefObject<string> }) {
  const [editor] = useLexicalComposerContext();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      setEditorHtml(editor, value);
      htmlRef.current = value;
      initializedRef.current = true;
      return;
    }

    // Ignore parent updates that are exactly editor's latest html to avoid cursor reset.
    if (value === htmlRef.current) return;

    htmlRef.current = value;
    setEditorHtml(editor, value);
  }, [editor, htmlRef, value]);

  return null;
}

export function RrhEditor({
  value = '',
  onChange,
  placeholder = '',
  className,
  disabled = false,
  onUploadImage,
}: RrhEditorProps) {
  const htmlRef = useRef(value);

  const initialConfig = useMemo(
    () => ({
      namespace: 'RrhEditor',
      onError: (error: Error) => {
        throw error;
      },
      editable: !disabled,
      nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, ImageNode],
    }),
    [disabled],
  );

  return (
    <div
      className={cn(
        'bg-background rounded-md border p-2',
        disabled && 'cursor-not-allowed opacity-70',
        className,
      )}
    >
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin disabled={disabled} onUploadImage={onUploadImage} />
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="min-h-44 w-full resize-y rounded-md border px-3 py-2 text-sm outline-none" />
          }
          placeholder={
            <div className="text-muted-foreground pointer-events-none px-3 py-2 text-sm">
              {placeholder}
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />

        <ValueSyncPlugin value={value} htmlRef={htmlRef} />

        <OnChangePlugin
          onChange={(editorState, editor) => {
            editorState.read(() => {
              const html = $generateHtmlFromNodes(editor, null);
              if (html !== htmlRef.current) {
                htmlRef.current = html;
                onChange?.(html);
              }
            });
          }}
        />
      </LexicalComposer>
    </div>
  );
}
