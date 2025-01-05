from moviepy import VideoFileClip, AudioFileClip

def importVideo(filePath):
    return VideoFileClip(filePath) 


def importAudio(filePath):
    return AudioFileClip(filePath) 