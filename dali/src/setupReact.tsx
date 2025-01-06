/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
import React, {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {CodeEditor} from "./components/codeEditor.tsx";
import {Box, CssBaseline, Typography} from "@mui/material";
import VideoDropzone from "./components/VideoDropZone.tsx";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import {Timeline} from "./components/Timeline";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <CssBaseline/>
        <PanelGroup direction="vertical"
                    style={{height: '100vh'}}
        >

            <Panel defaultSize={80}>
                <PanelGroup direction="horizontal"
                            style={{height: '100%'}}
                >
                    <Panel defaultSize={80}>

                        <CodeEditor/>
                    </Panel>
                    <PanelResizeHandle>
                        <Box
                            sx={{
                                height: "5px",
                                backgroundColor: "grey.300",
                                cursor: "ns-resize",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                        </Box>
                    </PanelResizeHandle>
                    <Panel
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "16px",
                        }}
                    >
                        <Typography variant="h6"
                                    sx={{marginBottom: 2}}
                                    maxHeight={"100vh"}

                        >Import Videos</Typography>

                        <VideoDropzone
                            maxFiles={50}
                            maxSize={1024 * 1024 * 1024}
                            uploadUrl={'http://localhost:5000/upload-videos/123123'}
                        />

                    </Panel>
                </PanelGroup>
            </Panel>
            <PanelResizeHandle>
                <Box
                    sx={{
                        height: "5px",
                        backgroundColor: "grey.300",
                        cursor: "ns-resize",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                </Box>
            </PanelResizeHandle>
            <Panel>
                <Timeline/>
            </Panel>
        </PanelGroup>


    </StrictMode>
    ,
)
