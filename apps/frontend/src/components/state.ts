import {create} from 'zustand'
import * as monaco from 'monaco-editor'

export interface CodeStore {
    code: string
    setCode: (code: string) => void
    resetCode: () => void
}

export const useCodeStore = create<CodeStore>((set) => ({
            code: '',
            setCode: (code) => set({code}),
            resetCode: () => set({code: ''})
        }
    )
)

interface SessionStore {
    session: string
    setSession: (session: string) => void
    resetSession: () => void
}

function randomUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export const useSessionStore = create<SessionStore>((set) => ({
            session: randomUUID(),
            setSession: (session) => set({session}),
            resetSession: () => set({session: ''})

        }
    )
)

interface EditorStore {
  editor:  monaco.editor
  setEditor: (editor: any) => void
  resetEditor: () => void
}


export const useEditorStore = create<EditorStore>((set) => ({
            editor: null,
            setEditor: (editor) => set({editor}),
            resetEditor: () => set({editor: null})
        }
    )
)
