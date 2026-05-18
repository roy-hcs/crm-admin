import {
  DecoratorNode,
  LexicalNode,
  SerializedLexicalNode,
  type DOMConversionMap,
  type DOMExportOutput,
} from 'lexical';
import { JSX } from 'react';

type ImagePayload = {
  src: string;
  alt?: string;
};

export type SerializedImageNode = {
  type: 'image';
  version: 1;
  src: string;
  alt?: string;
} & SerializedLexicalNode;

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __alt: string | undefined;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode({ src: node.__src, alt: node.__alt });
  }

  // 让 $generateNodesFromDOM 能把 <img> 标签转成 ImageNode
  static importDOM(): DOMConversionMap {
    return {
      img: (domNode: HTMLElement): import('lexical').DOMConversion<HTMLElement> | null => {
        if (domNode instanceof HTMLImageElement) {
          return {
            conversion: (node: HTMLElement) => {
              const img = node as HTMLImageElement;
              const { src, alt } = img;
              return {
                node: $createImageNode({ src, alt }),
              };
            },
            priority: 0,
          };
        }
        return null;
      },
    };
  }

  // 注意这里给第一个参数一个默认值，保证无参构造时也能正常工作
  constructor({ src, alt }: ImagePayload = { src: '' }) {
    super();
    this.__src = src;
    this.__alt = alt;
  }

  // JSON 序列化：用于保存编辑器状态
  exportJSON(): SerializedImageNode {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
      alt: this.__alt,
    };
  }

  // JSON 反序列化：用于从保存的状态恢复节点
  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { src, alt } = serializedNode;
    return $createImageNode({ src, alt });
  }

  // 让 $generateHtmlFromNodes 能把 ImageNode 导出成 <img>
  exportDOM(): DOMExportOutput {
    const element = document.createElement('img');
    element.setAttribute('src', this.__src);
    if (this.__alt) {
      element.setAttribute('alt', this.__alt);
    }
    return { element };
  }

  createDOM(): HTMLElement {
    const span = document.createElement('span');
    return span;
  }

  updateDOM(): boolean {
    return false;
  }

  decorate(): JSX.Element {
    return (
      <img
        src={this.__src}
        alt={this.__alt}
        style={{ maxWidth: '100%', display: 'block', margin: '8px 0' }}
        loading="lazy"
      />
    );
  }
}

export function $createImageNode(payload: ImagePayload): ImageNode {
  return new ImageNode(payload);
}

export function $isImageNode(node?: LexicalNode): node is ImageNode {
  return node instanceof ImageNode;
}
