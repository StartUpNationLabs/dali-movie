from moviepy import TextClip, ColorClip, CompositeVideoClip, VideoFileClip
from matplotlib.colors import to_rgb

class VideoWrapper():
    def __init__(self, videoPath):
        self.videoPath = videoPath
        self.video = VideoFileClip(videoPath)
        self.duration = self.video.duration

    def subclipped(self, start, end):
        videoCut = self.video.subclipped(start, end) 
        video = VideoWrapper(self.videoPath)
        video.video = videoCut
        return video

    def getmovie(self):
        return self.video

    
        
