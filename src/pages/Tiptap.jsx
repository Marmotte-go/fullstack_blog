import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";

import React, { useEffect, useRef, useContext, useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

import "./Tiptap.scss";

const MenuBar = ({ editor, uploadImage }) => {
  const fileInput = useRef(null);
  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    const downloadURL = await uploadImage(file);
    if (editor && downloadURL) {
      editor.chain().focus().setImage({ src: downloadURL }).run();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="toolbar">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        <b>Bold</b>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
      >
        <em>italic</em>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is-active" : ""}
      >
        <span style={{ textDecoration: "line-through" }}>strike</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "is-active" : ""}
      >
        <u>underline</u>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        disabled={!editor.can().chain().focus().toggleHighlight().run()}
        className={editor.isActive("highlight") ? "is-active" : ""}
      >
        highlight
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={editor.isActive("code") ? "is-active" : ""}
      >
        code
      </button>
      <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear marks
      </button>
      <button onClick={() => editor.chain().focus().clearNodes().run()}>
        clear nodes
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive("paragraph") ? "is-active" : ""}
      >
        paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
      >
        h1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
      >
        h2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
      >
        h3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={editor.isActive("heading", { level: 4 }) ? "is-active" : ""}
      >
        h4
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        bullet list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
      >
        ordered list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("codeBlock") ? "is-active" : ""}
      >
        code block
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "is-active" : ""}
      >
        blockquote
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        divider
      </button>
      <button
        onClick={() => {
          const url = window.prompt("URL");
          if (!url) {
            return;
          }
          editor.chain().focus().setImage({ src: url }).run();
        }}
      >
        image from url
      </button>
      <button
        onClick={() => {
          fileInput.current.click();
        }}
      >
        image from file
      </button>
      <input
        type="file"
        ref={fileInput}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="image/*"
      />
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        undo
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        redo
      </button>
    </div>
  );
};

const Tiptap = ({ uploadImage, content, setJsonContent }) => {
  //day and night mode shift
  const { theme } = useContext(ThemeContext);
  const editor = useEditor({
    extensions: [
      Underline,
      Highlight,
      Image,
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
      }),
    ],
    content: content,
  });

  useEffect(() => {
    editor?.commands.setContent(content);
  }, [content]);

  const [localContent, setLocalContent] = useState(editor?.getJSON());

  useEffect(() => {
    if (editor) {
      // Event listener for content changes
      const updateContent = () => {
        setLocalContent(editor.getJSON());
      };

      // Attach the event listener
      editor.on("update", updateContent);

      // Cleanup: Remove the event listener when the component is unmounted
      return () => {
        editor.off("update", updateContent);
      };
    }
  }, [editor]);

  useEffect(() => {
    setJsonContent(localContent);
  }, [localContent]);

  return (
    <div className={`tiptap ${theme === "light" ? "light" : ""}`}>
      <MenuBar editor={editor} uploadImage={uploadImage} />
      <EditorContent editor={editor} className="editor-container" />
    </div>
  );
};

export default Tiptap;
