import {Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {useState} from "react";
import {useMutation} from "react-query";
import {Configuration, DefaultApi, SessionIdTimelinePostRequest} from "../openapi";
import {useCodeStore, useSessionStore} from "./state";

export const Generate = () => {
  const sessionId = useSessionStore((state) => state.session);
  const code = useCodeStore((state) => state.code);
  const [isGenerating, setIsGenerating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const mutation = useMutation(
    async (data: SessionIdTimelinePostRequest) => {
      const api = new DefaultApi(
        new Configuration({
          basePath: "http://localhost:5000",
        })
      );
      setIsGenerating(true);
      return (await api.sessionIdGeneratePost(sessionId, {
        langium: code,
      })).data;
    },
    {
      onSuccess: (data) => {
        if (data.errors && data.errors.length > 0) {
          console.error(data.errors);
          setMessage("Video generation failed");
        } else {
          setMessage("Video generated successfully!");
          setVideoUrl(data.video ?? ''); // Save the video URL
        }
        setIsGenerating(false);
        setModalOpen(true);
      },
      onError: (error) => {
        console.error(error);
        setMessage("An error occurred during video generation.");
        setIsGenerating(false);
        setModalOpen(true);
      },
    }
  );

  function handleGenerateVideo() {
    setModalOpen(true);
    mutation.mutate({langium: code});
  }

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerateVideo}
        sx={{marginTop: 2}}
        disabled={isGenerating}
      >
        Generate Video
      </Button>

      {/* Full-Screen Modal for Loading */}
      <Dialog open={modalOpen} fullScreen>
        <DialogTitle>{isGenerating ? "Generating Video..." : "Video Generation Completed"}</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isGenerating ? (
            <>
              <CircularProgress size={50}/>
              <p>This operation might take a while...</p>
            </>
          ) : videoUrl ? (
            <>
              <video
                controls
                style={{
                  width: "80%", // Resize video to 80% of the screen width
                  maxWidth: "800px", // Optional: Limit the video to a maximum width
                }}
              >
                <source src={videoUrl} type="video/mp4"/>
                Your browser does not support the video tag.
              </video>
              <Button
                variant="contained"
                color="primary"
                href={videoUrl}
                download
                sx={{marginTop: 2}}
              >
                Download Video
              </Button>
              <div>{message}</div>
            </>
          ) : (
            <div>{message}</div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
