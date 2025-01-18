import sys
import os
import re

from moviepy import (ColorClip, VideoFileClip, AudioFileClip, VideoClip, CompositeVideoClip, concatenate_videoclips, concatenate_audioclips )
from moviepy.audio.AudioClip import AudioClip
from moviepy.video.VideoClip import VideoClip
from moviepy.video.VideoClip import TextClip

from .dali_clip import Dali_clip
from .enum import *
from .perf_profiler import Perf
from .textWrapper import TextWrapper
from .videoWrapper import VideoWrapper
from .audioWrapper import AudioWrapper


class Dali_movie():
    def __init__(self, font_path):
        self.export_mode = "export"
        
        if len(sys.argv) > 1:
            self.export_mode = "timeline"

        self._font_path = font_path
        self._timeline = {
            "video":[],
            "audio":[],
            "subtitle":[],
        }

        self.errors = []

    #EXPORT
    def export(self, output_filename = "./output.mp4"):
        
        if self.export_mode == "export":
            if self.export_mode != "timeline" : print(self)

            for clip in self._timeline["video"]:
                clip.media = clip.media.getmovie("video")
            video_track = self._add_blanks(self._timeline["video"], ColorClip((1280,720)))
            audio_track = self._add_blanks(self._timeline["audio"], AudioClip(lambda t: [0] * 2, fps=44100))
            
            for clip in self._timeline["subtitle"]:
                clip.media = clip.media.getmovie("subtitle")
            subtitle_track = self._add_blanks(self._timeline["subtitle"], TextClip(self._font_path, text="  ", font_size=20, size=(1280,720)).with_fps(20))

            for clip in self._timeline["audio"]:
                clip.media = clip.media.getmovie("audio")

            video_track = [clip.media for clip in video_track]
            audio_track = [clip.media for clip in audio_track]
            subtitle_track = [clip.media for clip in subtitle_track]

            final_track = [concatenate_videoclips(video_track, method="compose")]
            if(len(audio_track) > 0):
                final_audio = concatenate_audioclips(audio_track)
                final_track[0] = final_track[0].with_audio(final_audio)

            if(len(subtitle_track) > 0):
                final_track.append(concatenate_videoclips(subtitle_track, method="compose"))
                final_track[1].layer = 1

            if(len(final_track) > 1):
                final_track[0] = CompositeVideoClip(final_track)

            final_track[0].write_videofile(output_filename, fps=24)
            print('-----\n'+output_filename)
            return output_filename
        else:
            timeline = self.print_timeline(self._timeline["video"], self._timeline["audio"], self._timeline["subtitle"])
            print("-----\n"+str(timeline))

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
                        int(audio.start*1000),
                        int(audio.end*1000)
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
            video = VideoWrapper(filePath)
            return Dali_clip(name, video, 0)
        except Exception as e:
            try:
                absFilePath = os.path.abspath(filePath)
                video = VideoWrapper(absFilePath)
                return Dali_clip(name, video, 0)
            except Exception as e:
                pass
        sys.exit(f"ERROR-VIDEO_FILEPATH-{self._clean_path(filePath)}")

    def importAudio(self, name, filePath):
        try: 
            audio = AudioWrapper(filePath) 
            return Dali_clip(name, audio, 0)
        except Exception as e:
            try:
                filePath = os.path.abspath(filePath)
                audio = AudioWrapper(filePath) 
                return Dali_clip(name, audio, 0)
            except Exception as e:
                pass
        sys.exit(f"ERROR-AUDIO_FILEPATH-{self._clean_path(filePath)}")
    
    def _clean_path(self, path):
        pattern = r"(.*[a-f0-9-]{36})/(.*)"
        # Search using the pattern
        match = re.match(pattern, path)
        if match:
            result = match.group(2)
            return result  # Output the part before the UID
        else:
            return path
    
    #CUT
    def cut(self, name, video, start, end):
        media = video.media
        if (end - start) > media.duration:
            sys.exit(f"ERROR-CUT_TO_LONG-{name}")
            exit(1)
        video = media.subclipped(start, end)
        return Dali_clip(name, video, 0)

    def cut_start(self, name, video, start_trim):
        return  self.cut(name, video, 0, start_trim)

    def cut_end(self, name, video, end_trim):
        duration = video.media.duration
        return self.cut(name, video, duration-end_trim, duration)

    #TEXT
    def text(self, name, text, duration=5, backgroundColor=None, textColor = "black", position=(0, 0)):
        if self.export_mode != "timeline" : print(backgroundColor)
        return Dali_clip(name, TextWrapper(font_path=self._font_path, name=name, text=text, duration=duration, backgroundColor=backgroundColor, textColor=textColor, position=position), 0)

    #ADD TO TIMELINE
    def add(self, dali_clip, mode=None, offset=None, anchor_type=None, reference=None):
        if not mode:
            return self._add_append(dali_clip.name, dali_clip.media)
        if mode == MODE.START and anchor_type == "after" and reference:
            return self._add_starting_after(dali_clip.name, dali_clip.media, offset, reference)
        if mode == MODE.END and anchor_type == "before" and reference:
            return self._add_ending_before(dali_clip.name, dali_clip.media, offset, reference)
        if mode == MODE.END and anchor_type == "at" and reference:
            return self._add_ending_at(dali_clip.name, dali_clip.media, offset, reference)
        if mode == MODE.START and anchor_type == "at" and reference:
            return self._add_starting_at(dali_clip.name, dali_clip.media, offset, reference)
        return False

    def _add_append(self, name, media):
        start = Perf("add append")
        track, track_type = self._get_track(media, clip_type=True)
        if track_type == "subtitle":
            print("subtitle track")
            print(track)
            print(self._timeline["subtitle"] == self._timeline["audio"])
            track = self._timeline["video"]
        if track==None : return False
        
        if(len(track)) == 0:
            track.append(Dali_clip(name, media ,0))
        else:
            last_clip = track[-1]
            dali_clip = Dali_clip(name, media ,last_clip.end)
            track.append(dali_clip)
        print(len(self._timeline["audio"]))
        print(len(self._timeline["video"]))
        start.finish()
        return True

    def _add_starting_after(self, name, media, offset, reference):
        start = Perf(f"add starting after {name}")
        #try:
        if offset == None: 
            offset = 0

        anchor_time = self._get_reference(reference).end + offset
        track = self._get_track(media, anchor_time)
        
        index, previous_dali_clip, following_dali_clip = self._get_clip(track, anchor_time)  
        if previous_dali_clip != None:
            if following_dali_clip != None and following_dali_clip.start < anchor_time + media.duration:
                #print("NOT ENOUGH PLACE AFTER - Moving Timeline")
                overlap = anchor_time + media.duration - following_dali_clip.start
                self._move_clips(track, following_dali_clip, overlap)
        dali_clip = self._place_in_timeline(name, track, index, media, previous_dali_clip, anchor_time, following_dali_clip)
        
        if isinstance(media ,type(reference)) == False:
            #MOVE TOGETHER
            #print("Is a dependency")
            self._get_reference(reference).add_dependency(dali_clip)

        start.finish()

    def _add_ending_before(self, name, media, offset, reference):
        start = Perf(f"add ending before {name}")
        if offset == None: 
            offset = 0

        anchor_time = self._get_reference(reference).start - offset - media.duration
        track = self._get_track(media, anchor_time)
        
        index, previous_dali_clip, following_dali_clip = self._get_clip(track, anchor_time)
        if anchor_time < previous_dali_clip.end : anchor_time = previous_dali_clip.end

        if previous_dali_clip != None:
            if following_dali_clip != None and following_dali_clip.start < anchor_time + media.duration:
                #print("NOT ENOUGH PLACE AFTER - Moving Timeline")
                overlap = anchor_time + media.duration - following_dali_clip.start
                self._move_clips(track, following_dali_clip, overlap + offset)

        dali_clip = self._place_in_timeline(name, track, index, media, previous_dali_clip, anchor_time, following_dali_clip)
        if isinstance(media ,type(reference)) == False:
            #MOVE TOGETHER
            #print("Is a dependency")
            self._get_reference(reference).add_dependency(dali_clip)
        start.finish()

    def _add_ending_at(self, name, media, offset, reference):
        return

    def _add_starting_at(self, name, media, offset, reference):
        start = Perf(f"add starting at {name}")
        if offset == None: 
            offset = 0
        
        anchor_time = self._get_reference(reference).start + offset
        track = self._get_track(media, anchor_time)
        
        if isinstance(media ,type(reference)) == True:
            return False
        
        index, previous_dali_clip, following_dali_clip = self._get_clip(track, anchor_time)

        if previous_dali_clip != None:
            if following_dali_clip != None and following_dali_clip.start < anchor_time + media.duration:
                #print("NOT ENOUGH PLACE AFTER - Moving Timeline")
                overlap = anchor_time + media.duration - following_dali_clip.start
                self._move_clips(track, following_dali_clip, overlap + offset)
        dali_clip = self._place_in_timeline(name, track, index, media, previous_dali_clip, anchor_time, following_dali_clip)
        if isinstance(media ,type(reference)) == False:
            #MOVE TOGETHER
            #print("Is a dependency")
            self._get_reference(reference).add_dependency(dali_clip)
        start.finish()
    
    def _place_in_timeline(self, name, track, index, media, previous_dali_clip, anchor_time, following_dali_clip):
        if previous_dali_clip != None and previous_dali_clip.end > anchor_time:
            print(previous_dali_clip.end)
            print(anchor_time)
            print("NOT ENOUGH PLACE BEFORE")
            print(f"ERROR-NO_SPACE_TO_PLACE-{name}", file=sys.stderr)
            sys.stderr.write(f"ERROR-NO_SPACE_TO_PLACE-{name}\n")
            return False
        
        added_dali_clip = Dali_clip(name, media, anchor_time)
        track.insert(index+1, added_dali_clip) 
        return added_dali_clip


    def _get_track(self, media, anchor_time=None ,clip_type=False):
        if isinstance(media, TextWrapper):
            if anchor_time != None and self._can_be_placed(anchor_time, self._timeline["video"])==False:
                if self.export_mode != "timeline" : print("Is Subtitle")
                if self.export_mode != "timeline" : print(media.fps)
                # Subtitle
                if clip_type:
                    return self._timeline["subtitle"],"subtitle"
                return self._timeline["subtitle"]
            else:
                if self.export_mode != "timeline" : print("Is Title")
                if self.export_mode != "timeline" : print(media.fps)
                # Title
                if clip_type:
                    return self._timeline["video"],"video"
                return self._timeline["video"]
        elif isinstance(media, VideoWrapper):
            if self.export_mode != "timeline" : print("Is Video")
            if clip_type:
                    return self._timeline["video"],"video"
            return self._timeline["video"]
        elif isinstance(media, AudioWrapper):
            if self.export_mode != "timeline" : print("Is Audio")
            if clip_type:
                    return self._timeline["audio"],"audio"
            return self._timeline["audio"]
        else:
            return False
    
    def _can_be_placed(self, anchor_time, track):
        for clip in track:
            if clip.start <= anchor_time and clip.end > anchor_time:
                return False
            elif clip.start > anchor_time:
                return True
        return True

    def _get_reference_track(self, dali_clip):
        if dali_clip in self._timeline["video"]:
            return self._timeline["video"]
        elif dali_clip in self._timeline["subtitle"]:
            return self._timeline["subtitle"]
        elif dali_clip in self._timeline["audio"]:
            return self._timeline["audio"]
        else:
            sys.exit(f"ERROR-WRONG_REFERENCE-{dali_clip.name}")
        
    
    def _get_clip(self, track, anchor_time):
        try:
            if len(track) == 0:
                return 0, None, None
            if(track[0].start >= anchor_time):
                return 0, None, track[0]
            for i in range(len(track)):
                if track[i+1].start >= anchor_time:
                    return i, track[i], track[i+1]
        except Exception as e:
            pass
        return len(track)-1, track[-1], None

    def _get_reference(self, reference):
        reference_track = self._get_reference_track(reference)
        for i in range(len(reference_track)):
                if reference_track[i].media == reference.media:
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
            track = self._get_reference_track(dependency)
            dali_clip_on_track = next((clip for clip in track if clip.media == dependency.media), None)
            if dali_clip_on_track != None:
                dali_clip_on_track.start = dali_clip_on_track.start + offset
                dali_clip_on_track.end = dali_clip_on_track.start + dali_clip_on_track.media.duration

    def _add_blanks(self, track, addon):
        result = []
        for i in range(len(track)):
            if i > 0:
                previous_media = track[i-1]
                space = track[i].start - previous_media.end
            else:
                space = track[i].start

            if space > 0.1:
                dali_clip = None
                dali_clip = Dali_clip("blank", addon.with_duration(space), 0)
                result.append(dali_clip)    
            result.append(track[i])
        return result



    def __str__(self):
        return "audio     :" + str(self._timeline["audio"]) + \
                "\nsubtitle :" + str(self._timeline["subtitle"]) + \
                "\nvideo    :" + str(self._timeline["video"]) + "\n"