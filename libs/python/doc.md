# Architecture of moviepy usages

For the library, everything is a clip, a video, an audio, an image, it can be either the direct element loaded from the storage, or it can be made through function.
And the timeline we have don't exist, for them it's just a combination of clips, and they can be rendered, that's it.