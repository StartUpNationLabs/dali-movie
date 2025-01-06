

class Dali_clip():
    def __init__(self, media, start):
        self.media = media
        self.start = start
        self.end   = start + media.duration  

    def __str__(self):
        return f"{{start: {self.start}, end: {self.end}}}"

    def __repr__(self):
        return self.__str__()