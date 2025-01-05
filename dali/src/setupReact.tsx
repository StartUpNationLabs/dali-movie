/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <div>Test</div>
    </StrictMode>,
)
