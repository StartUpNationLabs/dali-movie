from dali_movie.dali_movie import Dali_movie, MODE, ANCHOR_TYPE
from moviepy.audio.AudioClip import AudioClip

#INIT
font_path = "./dali_movie/resources/arial.TTF"
dali_movie = Dali_movie(font_path)

#SCRIPT
clip1 = dali_movie.importVideo("../data/video1.mp4")
introSound = dali_movie.importAudio("../data/audio.mp3")

clip1a = dali_movie.cut(clip1, 2, 4)
clip1b = dali_movie.cut_start(clip1, 1.5)
clip1c = dali_movie.cut_end(clip1, 1)

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

title = dali_movie.title("-- I AM THE TITLE --")
title2 = dali_movie.title("-- I AM THE TITLE FOR 2 SEC --", duration=2)
dali_movie.add(title)
dali_movie.add(title2, MODE.START, 2, ANCHOR_TYPE.AFTER, title)

subtitle = dali_movie.subtitle("Je suis le sours-titre", 2)
dali_movie.add(subtitle, MODE.START, None, ANCHOR_TYPE.AT, clip1a)

#dali_movie.export()