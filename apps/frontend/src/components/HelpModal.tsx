import React, { useState } from 'react';
import { Modal, IconButton, Button, Typography } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import ReactMarkdown from 'react-markdown';

const HelpModal = () => {
  const [open, setOpen] = useState(false);
  const [helpText, setHelpText] = useState(`
# User Manual: DaliMovie Grammar

## 1. Import a Media

**Video:**

\`\`\`plaintext
import video myVideo "video.mp4"
\`\`\`

**Audio:**

\`\`\`plaintext
import audio myAudio "audio.mp3"
\`\`\`

## 2. Cut a Media

Cut a video or audio to a specific duration.

**Example:** Cut a video for 10 seconds from start:

\`\`\`plaintext
cut myVideo from start for 10s named myCut
\`\`\`

**Example:** Cut a 5-second portion between 10s and 15s:

\`\`\`plaintext
cut myVideo from 10s to 15s named myCut
\`\`\`

## 3. Add Text

Add text (titles, subtitles) with style and position options.

**Example:** Add a title for 5 seconds, in red, at the top-left corner:

\`\`\`plaintext
text "Welcome" for 5s color RED position 10, 10 named myText
\`\`\`

**Example:** Add a subtitle with a black background (positioning and background are optional):

\`\`\`plaintext
text "Subtitle here" for 10s background BLACK named mySubtitle
\`\`\`

## 4. Add Media or Text to the Script

Add an existing element (cut media, text) at a specific moment.

**Example:** Add a cut from the start, for 5 seconds, after another video:

The relative positioning is optional.

\`\`\`plaintext
add myCut from start for 5s starting after myVideo
\`\`\`

**Example:** Add text directly in the timeline after another element:

The relative positioning is optional.

\`\`\`plaintext
add [Thank you for watching!] for 5s starting after myText
\`\`\`

## 5. Export the Script

Generate a final file from the script.

**Example:** Export the result to a file named \`output.mp4\`:

\`\`\`plaintext
export here "output.mp4"
\`\`\`
  `);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <IconButton
        style={{ position: 'absolute', top: 0, right: 10, zIndex: 1000 }}
        color="primary"
        aria-label="help"
        onClick={handleOpen}
      >
        <HelpIcon />
      </IconButton>

      <Modal open={open} onClose={handleClose}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: 24,
            width: '80%',
            overflowY: 'auto',
            maxHeight: '80%',
          }}
        >
          <ReactMarkdown
            remarkRehypeOptions={{ allowDangerousHtml: true }}


          >{helpText}</ReactMarkdown>
          <Button onClick={handleClose} color="primary" style={{ marginTop: '10px' }}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default HelpModal;
