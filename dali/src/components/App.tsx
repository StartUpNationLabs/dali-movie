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


export const App = () => {

    const [isTimelineVisible, setIsTimelineVisible] = useState(true);
    const code = useCodeStore((state) => state.code);
    const sessionId = useSessionStore((state) => state.session);
    const mutation = useMutation(
        async (
            data: SessionIdTimelinePostRequest
        ) => {
            const api = new DefaultApi(
                new Configuration({
                    basePath: 'http://localhost:8080'
                })
            );
            return (await api.sessionIdGeneratePost(sessionId, {
                languim: code,
            })).data;

        }
        , {
            onSuccess: (data) => {
                // Invalidate and refetch
                if (data.errors && data.errors.length > 0) {
                    console.error(data.errors)
                } else {
                    alert("Video generated successfully" + data.video)
                }
            },
        })

    function handleGenerateVideo() {
        mutation.mutate({languim: code});
    }

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
                        uploadUrl={"http://localhost:5000/upload-videos/123123"}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleGenerateVideo}
                        sx={{marginTop: 2}}
                    >
                        Generate Video
                    </Button>
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
