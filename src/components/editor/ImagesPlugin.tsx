// ImagesPlugin.tsx
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $getSelection } from 'lexical';
import React, { useRef } from 'react';
import { $createImageNode } from './ImageNode';

type Props = {
  onUploadImage: (file: File) => Promise<string>;
};

export function ImagesPlugin({ onUploadImage }: Props) {
  const [editor] = useLexicalComposerContext();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChoose = () => {
    inputRef.current?.click();
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = async e => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await onUploadImage(file); // 调你自己的上传接口
      editor.update(() => {
        const selection = $getSelection();
        const imageNode = $createImageNode({ src: url });
        if (selection) {
          selection.insertNodes([imageNode]);
        } else {
          $getRoot().append(imageNode);
        }
      });
    } finally {
      e.target.value = '';
    }
  };

  return (
    <>
      <button type="button" onClick={handleChoose}>
        插入图片
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </>
  );
}
