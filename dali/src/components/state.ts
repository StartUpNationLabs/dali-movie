import {create} from 'zustand'

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
