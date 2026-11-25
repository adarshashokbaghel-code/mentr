"use client";

import { cn } from "@/lib/utils";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor as MonacoEditor } from "monaco-editor";
import { useEffect, useRef } from "react";

type MonacoApi = Parameters<OnMount>[1];

type Props = {
  value: string;
  onChange: (v: string) => void;
  onRun?: () => void;
  label?: string;
  markLine?: number;
  activeLine?: number;
  theme?: "dark" | "light";
  readOnly?: boolean;
  className?: string;
};

export function MonacoPyEditor({
  value,
  onChange,
  onRun,
  label = "Python code",
  markLine,
  activeLine,
  theme = "light",
  readOnly = false,
  className,
}: Props) {
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<MonacoApi | null>(null);
  const decoRef = useRef<string[]>([]);
  const runRef = useRef(onRun);
  const light = theme === "light";
  runRef.current = onRun;

  const onMount: OnMount = (ed, monaco) => {
    editorRef.current = ed;
    monacoRef.current = monaco;
    ed.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => runRef.current?.());
    ed.updateOptions({
      fontSize: 13.5,
      lineHeight: 22,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 4,
      insertSpaces: true,
      wordWrap: "on",
      renderLineHighlight: "line",
      padding: { top: 12, bottom: 12 },
      readOnly,
      ariaLabel: label,
      find: { addExtraSpaceOnTop: false },
    });
  };

  useEffect(() => {
    const ed = editorRef.current;
    const monaco = monacoRef.current;
    if (!ed || !monaco) return;
    const ranges: MonacoEditor.IModelDeltaDecoration[] = [];
    if (activeLine && activeLine > 0) {
      ranges.push({
        range: new monaco.Range(activeLine, 1, activeLine, 1),
        options: {
          isWholeLine: true,
          className: "py-monaco-active-line",
          linesDecorationsClassName: "py-monaco-active-gutter",
        },
      });
      ed.revealLineInCenterIfOutsideViewport(activeLine);
    } else if (markLine && markLine > 0) {
      ranges.push({
        range: new monaco.Range(markLine, 1, markLine, 1),
        options: {
          isWholeLine: true,
          className: "py-monaco-error-line",
          linesDecorationsClassName: "py-monaco-error-gutter",
        },
      });
    }
    decoRef.current = ed.deltaDecorations(decoRef.current, ranges);
  }, [activeLine, markLine, value]);

  useEffect(() => {
    editorRef.current?.updateOptions({ readOnly });
  }, [readOnly]);

  return (
    <div
      className={cn("py-ide relative h-full min-h-[220px] w-full overflow-hidden", light ? "bg-white" : "bg-[#1c2836]", className)}
      data-theme={theme}
    >
      <Editor
        language="python"
        theme={light ? "vs" : "vs-dark"}
        value={value}
        onChange={(next) => onChange(next ?? "")}
        onMount={onMount}
        loading={
          <div className={cn("flex h-full items-center justify-center text-[13px]", light ? "text-muted" : "text-white/50")}>
            Loading editor…
          </div>
        }
        options={{
          readOnly,
          fontSize: 13.5,
          minimap: { enabled: false },
          automaticLayout: true,
          wordWrap: "on",
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
}
