from moviepy import TextClip, ColorClip, CompositeVideoClip
from matplotlib.colors import to_rgb

class TextWrapper():
    def __init__(self, font_path, name, text, duration=5, backgroundColor=None, textColor = "black", position=(0, 0)):
        self.font_path=font_path
        self.name = name
        self.text = text.strip('"')
        self.duration = duration
        self.backgroundColor = backgroundColor
        self.textColor = textColor
        self.position = position
        self.fps=24
        self.size=(1280, 720)
        self.is_over = True

    def getmovie(self, clip_type="subtitle"):
        if clip_type=="video":
            if self.backgroundColor == None and self.textColor == "black":
                self.textColor = "white"

            text = TextClip(self.font_path, font_size=70, text=self.text, bg_color=self.backgroundColor, duration=self.duration, color=self.textColor, size=(1280,720))
            return text
        else:
            stroke_width =3
            if self.textColor == "black":
                stroke_width =0
            text = TextClip(self.font_path, font_size=36, text=self.text, bg_color=self.backgroundColor, method="caption", size=(1280,650), duration=self.duration, color=self.textColor, stroke_color='black', stroke_width=stroke_width, vertical_align="bottom")
            return text

    
        
