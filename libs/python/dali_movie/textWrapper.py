from moviepy import TextClip, ColorClip, CompositeVideoClip
from matplotlib.colors import to_rgb

class TextWrapper():
    def __init__(self, font_path, name, text, duration=5, backgroundColor=None, textColor = "black", position=(0, 0)):
        self.font_path=font_path
        self.name = name
        self.text = text
        self.duration = duration
        self.backgroundColor = backgroundColor
        self.textColor = textColor
        self.position = position
        self.fps=24
        self.size=(1280, 720)

    def getmovie(self):
        if self.backgroundColor != None:
            text = TextClip(self.font_path, font_size=26, text=self.text, bg_color=self.backgroundColor, duration=self.duration, color=self.textColor).with_fps(15).with_position(self.position, relative=True)
            rgb_color = tuple(int(255 * c) for c in to_rgb(self.backgroundColor))
            color = ColorClip(size=(1280, 720), color=rgb_color, duration=self.duration)
            text = text.with_position('center')
            return CompositeVideoClip([color, text])
        
        text = TextClip(self.font_path, font_size=26, text=self.text, duration=self.duration, color=self.textColor, size=(1280,720)).with_fps(20).with_position(self.position, relative=True)
        return text

    
        
