/* eslint-disable no-console */
"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { editorTheme } from "@/lib/rich-text-editor/themes/editor-theme";
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState, SerializedEditorState } from "lexical";

import { nodes } from "./nodes";
import { Plugins } from "./plugins";

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes,
  onError: (error: Error) => {
    console.error(error);
  },
};

export function Editor({
  editorState,
  editorSerializedState,
  onChange,
  onSerializedChange,
  readOnly = false,
  hideToolbar = false,
  placeholder,
  containerClassName,
  contentClassName,
}: {
  editorState?: EditorState;
  editorSerializedState?: SerializedEditorState;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
  readOnly?: boolean;
  hideToolbar?: boolean;
  placeholder?: string;
  containerClassName?: string;
  contentClassName?: string;
}) {
  return (
    <div className={containerClassName ?? "bg-background overflow-hidden rounded-lg border"}>
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          editable: !readOnly,
          ...(editorState ? { editorState } : {}),
          ...(editorSerializedState ? { editorState: JSON.stringify(editorSerializedState) } : {}),
        }}
      >
        <TooltipProvider>
          <Plugins
            hideToolbar={hideToolbar}
            placeholder={placeholder}
            contentClassName={contentClassName}
            readOnly={readOnly}
          />
          {readOnly || (!onChange && !onSerializedChange) ? null : (
            <OnChangePlugin
              ignoreSelectionChange={true}
              onChange={(editorState) => {
                onChange?.(editorState);
                onSerializedChange?.(editorState.toJSON());
              }}
            />
          )}
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}
