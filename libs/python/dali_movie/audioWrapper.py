from moviepy import AudioFileClip

class AudioWrapper():
    def __init__(self, audioPath):
        self.audioPath = audioPath
        self.audio = AudioFileClip(audioPath)
        self.duration = self.audio.duration

    def subclipped(self, start, end):
        audioCut = self.audio.subclipped(start, end) 
        audio = audioWrapper(self.audioPath)
        audio.audio = audioCut
        audio.duration = audioCut.duration 
        return audio

    def getmovie(self, clip_type="audio"):
        return self.audio

    
        
