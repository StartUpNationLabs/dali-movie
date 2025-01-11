from dali_movie.dali_movie import Dali_movie, MODE, ANCHOR_TYPE
from moviepy.audio.AudioClip import AudioClip
import os

# Suppress ffmpeg logs
os.environ["IMAGEIO_FFMPEG_LOGLEVEL"] = "error"


# Désactiver les logs en définissant un niveau élevé

#INIT
font_path = "./dali_movie/resources/arial.TTF"
dali_movie = Dali_movie(font_path)

#SCRIPT
clip1 = dali_movie.importVideo("../data/video1.mp4")
print("ok")
introSound = dali_movie.importAudio("../data/audio.mp3")
print("ok")
clip1a = dali_movie.cut(clip1, 2, 4)
print("ok")
clip1b = dali_movie.cut_start(clip1, 1.5)
print("ok")
clip1c = dali_movie.cut_end(clip1, 1)
print("ok")
dali_movie.add(clip1)
print(dali_movie)
dali_movie.add(clip1a, MODE.START, 1, ANCHOR_TYPE.AFTER, clip1)
print(dali_movie)
dali_movie.add(clip1b, MODE.END, 1, ANCHOR_TYPE.BEFORE, clip1a)
#print("Before")
print(dali_movie)
dali_movie.add(introSound, MODE.START, 0.5, ANCHOR_TYPE.AFTER, clip1a)
print(dali_movie)

dali_movie.add(clip1c, MODE.START, None, ANCHOR_TYPE.AFTER, clip1)
print(dali_movie)

print()
print("ADD SOUND")
dali_movie.add(introSound)
introSound2 = dali_movie.cut(introSound, 2, 4)
print(dali_movie)
dali_movie.add(introSound, MODE.START, 1, ANCHOR_TYPE.AFTER, clip1)
print(dali_movie)
dali_movie.add(introSound2, MODE.START, 2, ANCHOR_TYPE.AT, clip1)
print(dali_movie)


print("ADD TEXT")
title = dali_movie.text("-- I AM THE TITLE --", backgroundColor="black")
title2 = dali_movie.text("-- I AM THE TITLE FOR 2 SEC --", duration=2, backgroundColor="black")
dali_movie.add(title)
print(dali_movie)
dali_movie.add(title2, MODE.START, 2, ANCHOR_TYPE.AFTER, title)
print(dali_movie)
subtitle = dali_movie.text("-- I AM THE SUBTITLE --")
dali_movie.add(subtitle, MODE.START, None, ANCHOR_TYPE.AT, clip1a)
print(dali_movie)

#dali_movie.export()