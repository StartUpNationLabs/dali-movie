import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import {CodeEditor} from "./codeEditor.jsx";
import {Box, Button, IconButton, Typography} from "@mui/material";
import VideoDropzone from "./VideoDropZone.jsx";
import {Timeline} from "./Timeline.jsx";
import {useState} from "react";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {useMutation} from "react-query";
import {Configuration, DefaultApi, SessionIdTimelinePostRequest} from "../openapi";
import {useCodeStore, useSessionStore} from "./state.js";
import {Generate} from "./Generate";


export const App = () => {

    const [isTimelineVisible, setIsTimelineVisible] = useState(true);
    const sessionId = useSessionStore((state) => state.session);


    return (
        <>
            <PanelGroup direction="horizontal" style={{height: "100vh"}}>
                <Panel defaultSize={80}>
                    <PanelGroup direction="vertical" style={{height: "100%"}}>
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
                            ></Box>
                        </PanelResizeHandle>
                        {isTimelineVisible && (
                            <Panel>
                                <Timeline height={"100%"}/>
                            </Panel>
                        )}
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
                    ></Box>
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
                    <Typography
                        variant="h6"
                        sx={{marginBottom: 2}}
                    >
                        Import Videos
                    </Typography>

                    <VideoDropzone
                        maxFiles={50}
                        maxSize={1024 * 1024 * 1024}
                        uploadUrl={"http://localhost:5001/upload/" + sessionId}
                    />
                    <Generate/>
                </Panel>

            </PanelGroup>
            <Box
                sx={{
                    position: "absolute",
                    bottom: 3,
                    left: 3,
                    zIndex: 1000,
                }}
            >
                <IconButton
                    color="primary"
                    onClick={() => setIsTimelineVisible((prev) => !prev)}
                >
                    {isTimelineVisible ? <VisibilityOff/> : <Visibility/>}
                </IconButton>
            </Box>
        </>
    );
};
