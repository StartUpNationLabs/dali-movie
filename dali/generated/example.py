from dali_movie.dali_movie import Dali_movie
from moviepy.audio.AudioClip import AudioClip

FONT_PATH = "./dali_movie/resources/arial.TTF"

dali_movie = Dali_movie()

clip1 = dali_movie.importVideo("./clip1.mp4")
introSound = dali_movie.importAudio("intro_sound.mp3")
dali_movie.cut(clip1a, 23s, 1m47s)
dali_movie.cut_start(clip1b, 23s)
dali_movie.cut_end(clip1c, 23s)
dali_movie.export("./output.mp4")
