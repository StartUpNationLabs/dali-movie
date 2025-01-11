/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
import React, {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {CssBaseline} from "@mui/material";
import {App} from "./components/App.tsx";


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <CssBaseline/>
        <App/>
    </StrictMode>
    ,
)
