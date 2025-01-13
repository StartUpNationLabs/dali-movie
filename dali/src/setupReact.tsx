/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
import React, {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {CssBaseline} from "@mui/material";
import {App} from "./components/App.tsx";
import {QueryClient, QueryClientProvider} from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";

const queryClient = new QueryClient();


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <CssBaseline/>
        <QueryClientProvider client={queryClient}>
            <App/>
            <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
    </StrictMode>
    ,
)
