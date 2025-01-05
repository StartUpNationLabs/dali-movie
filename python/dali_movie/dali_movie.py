from moviepy import (VideoFileClip, VideoClip, CompositeVideoClip, concatenate_videoclips, concatenate_audioclips )
from moviepy.audio.AudioClip import AudioClip
from moviepy.video.VideoClip import VideoClip
from moviepy.video.VideoClip import TextClip

from .cut import *
from .importer import *
from .text import *


class Dali_movie():
    def __init__(self):
        self._video_track = []
        self._audio_track = []
        self._subtitle_track = []

    #EXPORT
    def export(self):
        print(self._video_track)
        final_track = [concatenate_videoclips(self._video_track, method="compose")]
        if(len(self._audio_track) > 0):
            final_audio = concatenate_audioclips(self._audio_track)
            final_track[0] = final_track[0].with_audio(final_audio)

        if(len(self._subtitle_track) > 0):
            final_track.append(concatenate_videoclips(self._subtitle_track, method="compose"))

        if(len(final_track) > 1):
            final_track = CompositeVideoClip(final_track)
        final_track[0].write_videofile("./output.mp4", fps=24)
        
    #IMPORT
    def importVideo(self, filePath):
        return VideoFileClip(filePath) 

    def importAudio(self, filePath):
        return AudioFileClip(filePath) 
    
    #CUT
    def cut(self, video, start, end):
        return video.subclipped(start, end)

    def cutStart(self, video, start_trim):
        return video.subclipped(start_trim, video.duration)

    def cutEnd(self, video, end_trim):
        return video.subclipped(0, video.duration - end_trim )

    #TEXT
    def title(self, text, backgroundColor="black", duration=5, textColor = "black"):
        if backgroundColor == "black":
            textColor = "white"
        return TextClip(FONT_PATH, font_size=20, text=text, bg_color=backgroundColor, duration=duration, color=textColor)

    def subTitle(self, text):
        return TextClip(FONT_PATH, text=text)

    #ADD TO TIMELINE
    def basicAdd(self, media):
        if isinstance(media, AudioClip):
            self._audio_track.append(media)
        elif isinstance(media, VideoClip):
            self._video_track.append(media)
        elif isinstance(media, TextClip):
            if media.bg_color is None:
                # Subtitle
                self._subtitle_track.append(media)
            else:
                # Title
                self._video_track.append(media)
        else:
            return False
        return True

    def add(self, media, mode=None, offset=None, reference=None):
        if not mode:
            self.basicAdd(media)