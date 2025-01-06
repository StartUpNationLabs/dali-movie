from moviepy import (VideoFileClip, AudioFileClip, VideoClip, CompositeVideoClip, concatenate_videoclips, concatenate_audioclips )
from moviepy.audio.AudioClip import AudioClip
from moviepy.video.VideoClip import VideoClip
from moviepy.video.VideoClip import TextClip

from .dali_clip import Dali_clip
from .enum import *


class Dali_movie():
    def __init__(self, font_path):
        self._font_path = font_path
        self._video_track = []
        self._audio_track = []
        self._subtitle_track = []

    #EXPORT
    def export(self):
        print(self._video_track)
        video_track = [clip.media for clip in self._video_track]
        audio_track = [clip.media for clip in self._audio_track]
        subtitle_track = [clip.media for clip in self._subtitle_track]

        final_track = [concatenate_videoclips(video_track, method="compose")]
        if(len(audio_track) > 0):
            final_audio = concatenate_audioclips(audio_track)
            final_track[0] = final_track[0].with_audio(final_audio)

        if(len(subtitle_track) > 0):
            final_track.append(concatenate_videoclips(subtitle_track, method="compose"))

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

    def cut_start(self, video, start_trim):
        return video.subclipped(0, start_trim)

    def cut_end(self, video, end_trim):
        return video.subclipped(video.duration-end_trim, video.duration)

    #TEXT
    def title(self, text, backgroundColor="black", duration=5, textColor = "black"):
        if backgroundColor == "black":
            textColor = "white"
        return TextClip(self._font_path, font_size=20, text=text, bg_color=backgroundColor, duration=duration, color=textColor).with_fps(24)

    def subtitle(self, text, duration=5):
        return TextClip(self._font_path, font_size=14,text=text, duration=duration)

    #ADD TO TIMELINE
    def add(self, media, mode=None, offset=None, reference=None):
        if not mode:
            return self._add_append(media)
        if mode == Placement_Mode.AFTER and reference:
            return self._add_after(media, offset, reference)
        
        if mode == Placement_Mode.FROM and reference:
            return self._add_from(media, offset, reference)

        return False

    def _add_append(self, media):
        track = self._get_track(media)
        if track==None : return False
        
        if(len(track)) == 0:
            track.append(Dali_clip(media ,0))
        else:
            last_clip = track[-1]
            dali_clip = Dali_clip(media ,last_clip.end)
            track.append(dali_clip)
        return True

    def _add_after(self, media, offset, reference):
        #try:
        if offset == None: 
            offset = 0
        track = self._get_track(media)
        anchor_time = self._get_reference_end(reference) + offset
        index, previous_dali_clip, following_dali_clip = self._get_clip(track, anchor_time)
        if following_dali_clip != None and following_dali_clip.start < anchor_time + media.duration:
            print("NOT ENOUGH PLACE AFTER")
            return False
        if previous_dali_clip.end > anchor_time:
            print("NOT ENOUGH PLACE BEFORE")
            return False
        
        #CLIP CAN BE PLACED
        added_dali_clip = Dali_clip(media, anchor_time)
        track.insert(index+1, added_dali_clip) 
        #except Exception as e:
        #    print( f"Exception : {e}")
        #    return False
    
        
        
        
    def _add_from(self, media, offset, reference):
        if offset == None: 
            offset = 0
        if isinstance(media, type(reference)):
            return False

        track = self._get_track(media)



    def _get_track(self, media):
        if isinstance(media, AudioClip):
            return self._audio_track
        elif isinstance(media, VideoClip):
            return self._video_track
        elif isinstance(media, TextClip):
            if media.bg_color is None:
                # Subtitle
                return self._subtitle_track
            else:
                # Title
                return self._video_track
        else:
            return False
        return True
    
    def _get_clip(self, track, anchor_time):
        try:
            for i in range(len(track)):
                if track[i+1].start > anchor_time:
                    return i, track[i], track[i+1]
        except Exception as e:
            pass
        return len(track)-1, track[-1], None

    def _get_reference_end(self, reference):
        reference_track = self._get_track(reference)
        for i in range(len(reference_track)):
                if isinstance(reference_track[i].media, type(reference)) and reference_track[i].media == reference:
                    return reference_track[i].end
        return None

    def _get_reference_start(self, reference):
        reference_track = self._get_track(reference)
        for i in range(len(track)):
                if track[i].media == reference:
                    return track[i].start
        return None

    def __str__(self):

        return "audio     :" + str(self._audio_track) + \
                "\nsubtitle :" + str(self._subtitle_track) + \
                "\nvideo    :" + str(self._video_track) + "\n"