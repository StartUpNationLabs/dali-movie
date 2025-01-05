
FONT_PATH = "./dali_movie/resources/arial.TTF"

def title(text, backgroundColor="black"):
    return TextClip(FONT_PATH, text=text, bg_color=backgroundColor)

def subTitle(text):
    return TextClip(FONT_PATH, text=text)