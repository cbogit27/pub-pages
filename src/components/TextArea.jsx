"use client";
import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";

export default function TextArea({ value, onChange, ...props }) {
  const editorRef = useRef(null);
  const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY; // Ensure this is in .env.local

  return (
    <Editor
      apiKey={apiKey} // Use the publicly exposed API key
      onInit={(evt, editor) => (editorRef.current = editor)}
      value={value}
      onEditorChange={(content) => {
        onChange({ target: { name: props.name, value: content } });
      }}
      init={{
        height: 300,
        menubar: true,
        plugins:
          "lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount",
        toolbar:
          "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | code",
        content_style: "body { font-family:Arial,sans-serif; font-size:14px }",
      }}
    />
  );
}
