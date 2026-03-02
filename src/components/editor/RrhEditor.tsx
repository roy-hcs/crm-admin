// RrhEditor.tsx
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';

import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';
import {
  $createParagraphNode,
  $getRoot,
  $isDecoratorNode,
  $isElementNode,
  ParagraphNode,
  type EditorState,
  type LexicalEditor,
} from 'lexical';
import { $generateNodesFromDOM, $generateHtmlFromNodes } from '@lexical/html';

import { ImageNode } from './ImageNode';
import { ImagesPlugin } from './ImagesPlugin';
import { ToolbarPlugin } from './ToolbarPlugin';

type RrhEditorProps = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onUploadImage: (file: File) => Promise<string>; // 上传返回图片 URL
};

const theme = {
  // 按需填样式 className，先留空也可以
};

export function RrhEditor({ placeholder, value, onChange, onUploadImage }: RrhEditorProps) {
  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError: (error: Error) => {
      console.error(error);
    },
    // 注册富文本节点 + 图片节点
    nodes: [ParagraphNode, HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, ImageNode],
    // 如果外部传入初始值（HTML 字符串），转成 Lexical 节点
    editorState:
      value && value.trim().length > 0
        ? (editor: LexicalEditor) => {
            editor.update(() => {
              const parser = new DOMParser();
              const dom = parser.parseFromString(value, 'text/html');
              const root = $getRoot();
              const body = dom.body || dom;
              const nodes = $generateNodesFromDOM(editor, body);

              root.clear();

              let paragraph: ParagraphNode | null = null;

              nodes.forEach(node => {
                if ($isElementNode(node) || $isDecoratorNode(node)) {
                  if (paragraph && (paragraph as ParagraphNode).getChildrenSize() > 0) {
                    root.append(paragraph);
                    paragraph = null;
                  }
                  root.append(node);
                } else {
                  if (!paragraph) {
                    paragraph = $createParagraphNode();
                  }
                  paragraph.append(node);
                }
              });

              if (paragraph && (paragraph as ParagraphNode).getChildrenSize() > 0) {
                root.append(paragraph);
              }
            });
          }
        : undefined,
  } as const;

  const handleChange = (editorState: EditorState, editor: LexicalEditor) => {
    if (!onChange) return;
    editorState.read(() => {
      const html = $generateHtmlFromNodes(editor, null);
      onChange(html);
    });
  };

  const placeholderText = placeholder ?? '请输入内容…';

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="space-y-2 rounded border p-2">
        <ToolbarPlugin />
        <div className="relative">
          <RichTextPlugin
            contentEditable={<ContentEditable className="min-h-[120px] outline-none" />}
            placeholder={
              <div className="pointer-events-none absolute top-2 left-3 text-gray-400">
                {placeholderText}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <OnChangePlugin onChange={handleChange} />
        <ImagesPlugin onUploadImage={onUploadImage} />
      </div>
    </LexicalComposer>
  );
}
