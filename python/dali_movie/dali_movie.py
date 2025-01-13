import sys
import os

from moviepy import (ColorClip, VideoFileClip, AudioFileClip, VideoClip, CompositeVideoClip, concatenate_videoclips, concatenate_audioclips )
from moviepy.audio.AudioClip import AudioClip
from moviepy.video.VideoClip import VideoClip
from moviepy.video.VideoClip import TextClip

from .dali_clip import Dali_clip
from .enum import *
from .perf_profiler import Perf


class Dali_movie():
    def __init__(self, font_path):
        self.export_mode = "export" #sys.argv[1]

        self._font_path = font_path
        self._video_track = []
        self._audio_track = []
        self._subtitle_track = []

    #EXPORT
    def export(self, output_filename = "./output.mp4"):
        
        if self.export_mode == "export":
            if self.export_mode != "timeline" : print(self._video_track)

            video_track = self._add_blanks(self._video_track)
            audio_track = self._add_blanks(self._audio_track)
            subtitle_track = self._add_blanks(self._subtitle_track)

            video_track = [clip.media for clip in video_track]
            audio_track = [clip.media for clip in audio_track]
            subtitle_track = [clip.media for clip in subtitle_track]

            final_track = [concatenate_videoclips(video_track, method="compose")]
            if(len(audio_track) > 0):
                final_audio = concatenate_audioclips(audio_track)
                final_track[0] = final_track[0].with_audio(final_audio)

            if(len(subtitle_track) > 0):
                final_track.append(concatenate_videoclips(subtitle_track, method="compose"))

            if(len(final_track) > 1):
                final_track[0] = CompositeVideoClip(final_track)

            final_track[0].write_videofile(output_filename, fps=24)
            return output_filename
        else:
            timeline = self.print_timeline(self._video_track, self._audio_track, self._subtitle_track)
            print("-----"+str(timeline))

    def print_timeline(self, videos, audios, subtitles):
        timeline = [
            {
                "name": 'Video',
                "data": []
            },
            {
                "name": 'Sound',
                "data": []
            },
            {
                "name": 'Subtitles',
                "data": []
            }
        ]

        for video in videos:
            timeline[0]["data"].append(
                {
                    "x": video.name,
                    "y": [
                        int(video.start*1000),
                        int(video.end*1000)
                    ]
                })
        for audio in audios:
            timeline[1]["data"].append(
                {
                    "x": audio.name,
                    "y": [
                        int(video.start*1000),
                        int(video.end*1000)
                    ]
                })
        for subtitle in subtitles:
            timeline[2]["data"].append(
                {
                    "x": subtitle.name,
                    "y": [
                        int(subtitle.start*1000),
                        int(subtitle.end*1000)
                    ]
                })

        return timeline

        
    #IMPORT
    def importVideo(self, name, filePath):
        try:    
            video = VideoFileClip(filePath)
            return Dali_clip(name, video, 0)
        except Exception as e:
            filePath = os.path.abspath(filePath)
            video = VideoFileClip(filePath)
            return Dali_clip(name, video, 0)

    def importAudio(self, name, filePath):
        try: 
            audio = AudioFileClip(filePath) 
            return Dali_clip(name, audio, 0)
        except Exception as e:
            filePath = os.path.abspath(filePath)
            audio = AudioFileClip(filePath) 
            return Dali_clip(name, audio, 0)
    
    #CUT
    def cut(self, name, video, start, end):
        media = video.media
        video = media.subclipped(start, end)
        return Dali_clip(name, video, 0)

    def cut_start(self, name, video, start_trim):
        media = video.media
        video = media.subclipped(0, start_trim)
        return Dali_clip(name, video, 0)

    def cut_end(self, name, video, end_trim):
        media = video.media
        video = media.subclipped(media.duration-end_trim, media.duration)
        return Dali_clip(name, video, 0)

    #TEXT
    def text(self, name, text, duration=5, backgroundColor=None, textColor = "black", position=(0, 0)):
        if self.export_mode != "timeline" : print(backgroundColor)
        if backgroundColor != None:
            text = TextClip(self._font_path, font_size=20, text=text, bg_color=backgroundColor, duration=duration, color=textColor).with_fps(15).with_position(position, relative=True)
            return Dali_clip(name, text, 0)
        
        if self.export_mode != "timeline" : print("subtitle")
        text = TextClip(self._font_path, font_size=20, text=text, duration=duration, color=textColor).with_fps(20).with_position(position, relative=True)
        return Dali_clip(name, text, 0)

    #ADD TO TIMELINE
    def add(self, dali_clip, mode=None, offset=None, anchor_type=None, reference=None):
        if not mode:
            return self._add_append(dali_clip.name, dali_clip.media)
        if mode == MODE.START and anchor_type == "after" and reference:
            return self._add_starting_after(dali_clip.name, dali_clip.media, offset, reference.media)
        if mode == MODE.END and anchor_type == "before" and reference:
            return self._add_ending_before(dali_clip.name, dali_clip.media, offset, reference.media)
        if mode == MODE.END and anchor_type == "at" and reference:
            return self._add_ending_at(dali_clip.name, dali_clip.media, offset, reference.media)
        if mode == MODE.START and anchor_type == "at" and reference:
            return self._add_starting_at(dali_clip.name, dali_clip.media, offset, reference.media)
        return False

    def _add_append(self, name, media):
        start = Perf("add append")
        track = self._get_track(media)
        if track==None : return False
        
        if(len(track)) == 0:
            track.append(Dali_clip(name, media ,0))
        else:
            last_clip = track[-1]
            dali_clip = Dali_clip(name, media ,last_clip.end)
            track.append(dali_clip)
        start.finish()
        return True

    def _add_starting_after(self, name, media, offset, reference):
        start = Perf("add starting after")
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
        self._place_in_timeline(name, track, index, media, previous_dali_clip, anchor_time, following_dali_clip)
        start.finish()

    def _add_ending_before(self, name, media, offset, reference):
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

        self._place_in_timeline(name, track, index, media, previous_dali_clip, anchor_time, following_dali_clip)

    def _add_ending_at(self, name, media, offset, reference):
        return

    def _add_starting_at(self, name, media, offset, reference):
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
        self._place_in_timeline(name, track, index, media, previous_dali_clip, anchor_time, following_dali_clip)
    
    def _place_in_timeline(self, name, track, index, media, previous_dali_clip, anchor_time, following_dali_clip):
        if previous_dali_clip != None and previous_dali_clip.end > anchor_time:
            print(previous_dali_clip.end)
            print(anchor_time)
            print("NOT ENOUGH PLACE BEFORE")
            return False
        
        added_dali_clip = Dali_clip(name, media, anchor_time)
        track.insert(index+1, added_dali_clip) 


    def _get_track(self, media):

        if isinstance(media, TextClip):
            if media.fps > 15:
                if self.export_mode != "timeline" : print("Is Subtitle")
                if self.export_mode != "timeline" : print(media.fps)
                # Subtitle
                return self._subtitle_track
            else:
                if self.export_mode != "timeline" : print("Is Title")
                if self.export_mode != "timeline" : print(media.fps)
                # Title
                return self._video_track
        elif isinstance(media, VideoClip):
            if self.export_mode != "timeline" : print("Is Video")
            return self._video_track
        elif isinstance(media, AudioClip):
            if self.export_mode != "timeline" : print("Is Audio")
            return self._audio_track
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

    def _add_blanks(self, track):
        result = []
        for i in range(len(track)):
            if i > 0:
                previous_media = track[i-1]
                space = track[i].start - previous_media.end
            else:
                space = track[i].start

            if space > 0.1:
                dali_clip = None
                if isinstance(track[i].media, TextClip):
                    dali_clip = Dali_clip("blank", ColorClip((1280,720), color=(0, 0, 0, 0), duration=space), 0)
                if isinstance(track[i].media, AudioClip):
                    dali_clip = Dali_clip("blank", AudioClip(lambda t: [0] * 2, duration=space, fps=44100), 0)
                if isinstance(track[i].media, VideoClip):
                    dali_clip = Dali_clip("blank", ColorClip((1280,720) ,duration=space), 0)
                else:
                    print("Wrong type : " + str(type(track[i])))
                result.append(dali_clip)    
            result.append(track[i])
        return result



    def __str__(self):
        return "audio     :" + str(self._audio_track) + \
                "\nsubtitle :" + str(self._subtitle_track) + \
                "\nvideo    :" + str(self._video_track) + "\n"