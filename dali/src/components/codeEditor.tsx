import {useEffect, useRef} from "react";
import {MonacoEditorLanguageClientWrapper} from "monaco-editor-wrapper";
import {setupConfigClassic} from "../setupClassic.ts";

const userConfig = setupConfigClassic();
const wrapper = new MonacoEditorLanguageClientWrapper();

export const CodeEditor = () => {

    const ref = useRef<HTMLDivElement>(null!);
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            wrapper.initAndStart(userConfig, ref.current).then(r => {
                    console.log('editor started');
                    wrapper.getEditor()?.onDidChangeModelContent(
                        (e) => {
                            console.log(wrapper.getEditor()?.getValue())
                            // console log the ast

                        }


                    )
                }
            );
            initialized.current = true;

        }
    }, []);

    return (
        <div ref={ref} style={{width: '100%', height: '100%'}}/>
    );

}