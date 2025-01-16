

class Dali_clip():
    def __init__(self, name, media, start):
        self.media = media
        self.start = start
        self.end   = start + media.duration  
        self.dependencies = []
        self.name = name

    def add_dependency(self, reference):
        self.dependencies.append(reference)

    def __str__(self):
        return f"{{name: {self.name}, start: {self.start}, end: {self.end}}}"

    def __repr__(self):
        return self.__str__()
    
    def __eq__(self, other):
        if isinstance(other, Dali_clip):
            return self.name == other.name and self.media == other.media
        return False