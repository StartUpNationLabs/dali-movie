import {useEffect, useRef} from "react";
import {MonacoEditorLanguageClientWrapper} from "monaco-editor-wrapper";
import {setupConfigClassic} from "../setupClassic.js";
import {useCodeStore, useEditorStore} from "./state.js";

const userConfig = setupConfigClassic();
const wrapper = new MonacoEditorLanguageClientWrapper();

export const CodeEditor = () => {

  const ref = useRef<HTMLDivElement>(null!);
  const initialized = useRef(false);
  const setCode = useCodeStore((state) => state.setCode);
  const setEditor = useEditorStore((state) => state.setEditor);
  useEffect(() => {
    if (!initialized.current) {
      wrapper.initAndStart({
        ...userConfig
      }, ref.current).then(r => {
          console.log('editor started');
          wrapper.getEditor()?.onDidChangeModelContent(
            (e) => {
              setCode(wrapper.getEditor()?.getValue() || '');
            }
          )
          setEditor(wrapper.getEditor());
        }
      );
      initialized.current = true;

    }
  }, []);

  return (
    <div ref={ref} style={{width: '100%', height: '100%'}}/>
  );
}
