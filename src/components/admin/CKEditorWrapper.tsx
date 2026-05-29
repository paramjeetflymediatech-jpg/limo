"use client";

import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
// @ts-ignore
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface CKEditorWrapperProps {
  value: string;
  onChange: (data: string) => void;
}

export default function CKEditorWrapper({ value, onChange }: CKEditorWrapperProps) {
  return (
    <div className="prose max-w-none text-gray-900 min-h-[200px]">
      <CKEditor
        editor={ClassicEditor as any}
        data={value}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
        config={{
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "blockQuote",
            "undo",
            "redo",
          ],
        }}
      />
    </div>
  );
}
