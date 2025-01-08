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
        return TextClip(self._font_path, font_size=14,text=text, duration=duration).with_fps(24)

    #ADD TO TIMELINE
    def add(self, media, mode=None, offset=None, anchor_type=None, reference=None):
        if not mode:
            return self._add_append(media)

        if mode == MODE.START and anchor_type == ANCHOR_TYPE.AFTER and reference:
            return self._add_starting_after(media, offset, reference)
        if mode == MODE.END and anchor_type == ANCHOR_TYPE.BEFORE and reference:
            return self._add_ending_before(media, offset, reference)
        if mode == MODE.END and anchor_type == ANCHOR_TYPE.AT and reference:
            return self._add_ending_at(media, offset, reference)
        if mode == MODE.START and anchor_type == ANCHOR_TYPE.AT and reference:
            return self._add_starting_at(media, offset, reference)

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

    def _add_starting_after(self, media, offset, reference):
        #try:
        if offset == None: 
            offset = 0
        track = self._get_track(media)
        anchor_time = self._get_reference(reference).end + offset
        
        if isinstance(media ,type(reference)) == False:
            #MOVE TOGETHER
            #print("Is a dependency")
            self._get_reference(reference).add_dependency(media)

        index, previous_dali_clip, following_dali_clip = self._get_clip(track, anchor_time)
        
        if previous_dali_clip != None:
            if following_dali_clip != None and following_dali_clip.start < anchor_time + media.duration:
                #print("NOT ENOUGH PLACE AFTER - Moving Timeline")
                overlap = anchor_time + media.duration - following_dali_clip.start
                self._move_clips(track, following_dali_clip, overlap)

        self._place_in_timeline(track, index, media, previous_dali_clip, anchor_time)
        #except Exception as e:
        #    print( f"Exception : {e}")
        #    return False

    def _add_ending_before(self, media, offset, reference):
        if offset == None: 
            offset = 0
        track = self._get_track(media)
        anchor_time = self._get_reference(reference).start - offset - media.duration
        
        if isinstance(media ,type(reference)) == False:
            #MOVE TOGETHER
            self._get_reference(reference).add_dependency(media)
        index, previous_dali_clip, following_dali_clip = self._get_clip(track, anchor_time)
        if anchor_time < previous_dali_clip.end : anchor_time = previous_dali_clip.end

        if previous_dali_clip != None:
            if following_dali_clip != None and following_dali_clip.start < anchor_time + media.duration:
                #print("NOT ENOUGH PLACE AFTER - Moving Timeline")
                overlap = anchor_time + media.duration - following_dali_clip.start
                self._move_clips(track, following_dali_clip, overlap + offset)

        self._place_in_timeline(track, index, media, previous_dali_clip, anchor_time)

    def _add_ending_at(self, media, offset, reference):
        return

    def _add_starting_at(self, media, offset, reference):
        if offset == None: 
            offset = 0
        track = self._get_track(media)
        anchor_time = self._get_reference(reference).start + offset
        
        if isinstance(media ,type(reference)) == False:
            #MOVE TOGETHER
            self._get_reference(reference).add_dependency(media)
        else:
            return False
        
        index, previous_dali_clip, following_dali_clip = self._get_clip(track, anchor_time)

        if previous_dali_clip != None:
            if following_dali_clip != None and following_dali_clip.start < anchor_time + media.duration:
                #print("NOT ENOUGH PLACE AFTER - Moving Timeline")
                overlap = anchor_time + media.duration - following_dali_clip.start
                self._move_clips(track, following_dali_clip, overlap + offset)

        self._place_in_timeline(track, index, media, previous_dali_clip, anchor_time)
    
    def _place_in_timeline(self, track, index, media, previous_dali_clip, anchor_time):
        if previous_dali_clip != None and previous_dali_clip.end > anchor_time:
            print(previous_dali_clip.end)
            print(anchor_time)
            print("NOT ENOUGH PLACE BEFORE")
            return False
        
        #CLIP CAN BE PLACED
        added_dali_clip = Dali_clip(media, anchor_time)
        track.insert(index+1, added_dali_clip) 


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
            if len(track) == 0:
                return -1, None, None
            if(track[0].start >= anchor_time):
                return -1, None, track[0]
            for i in range(len(track)):
                if track[i+1].start >= anchor_time:
                    return i, track[i], track[i+1]
        except Exception as e:
            pass
        return len(track)-1, track[-1], None

    def _get_reference(self, reference):
        reference_track = self._get_track(reference)
        for i in range(len(reference_track)):
                if isinstance(reference_track[i].media, type(reference)) and reference_track[i].media == reference:
                    return reference_track[i]
        return None
    
    def _move_clips(self, track, reference_dali_clip, offset):
        move = False
        for i in range(len(track)):
                if isinstance(track[i], type(reference_dali_clip)) and track[i] == reference_dali_clip:
                    move = True
                if move == True:
                    track[i].start = track[i].start + offset
                    track[i].end = track[i].start + track[i].media.duration
                    self._move_dependencies(track[i], offset)

        return None
    
    def _move_dependencies(self, dali_clip, offset):
        for dependency in dali_clip.dependencies:
            track = self._get_track(dependency)
            dali_clip_on_track = next((clip for clip in track if clip.media == dependency), None)
            if dali_clip_on_track != None:
                dali_clip_on_track.start = dali_clip_on_track.start + offset
                dali_clip_on_track.end = dali_clip_on_track.start + dali_clip_on_track.media.duration


    def __str__(self):

        return "audio     :" + str(self._audio_track) + \
                "\nsubtitle :" + str(self._subtitle_track) + \
                "\nvideo    :" + str(self._video_track) + "\n"