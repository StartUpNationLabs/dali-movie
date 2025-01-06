from dali_movie.dali_movie import Dali_movie, Placement_Mode
from moviepy.audio.AudioClip import AudioClip

#INIT
font_path = "./dali_movie/resources/arial.TTF"
dali_movie = Dali_movie(font_path)

#SCRIPT
clip1 = dali_movie.importVideo("../data/video1.mp4")
introSound = dali_movie.importAudio("../data/audio.mp3")

clip1a = dali_movie.cut(clip1, 0, 5)
clip1a = dali_movie.cut(clip1, 2, 4)
clip1b = dali_movie.cut_start(clip1, 1.5)
clip1c = dali_movie.cut_end(clip1, 1)

dali_movie.add(clip1)
print(dali_movie)
dali_movie.add(clip1a, Placement_Mode.AFTER, 2, clip1)
print(dali_movie)
dali_movie.add(clip1a, Placement_Mode.FROM, 3, clip1)
print(dali_movie)
dali_movie.add(clip1c, Placement_Mode.AFTER, None, clip1a)
print(dali_movie)

dali_movie.add(introSound)
introSound2 = dali_movie.cut(introSound, 2, 4)
dali_movie.add(introSound, Placement_Mode.AFTER, 2, clip1)
dali_movie.add(introSound2, Placement_Mode.FROM, 2, clip1c)

title = dali_movie.title("-- I AM THE TITLE --")
title2 = dali_movie.title("-- I AM THE TITLE FOR 2 SEC --", duration=2)
dali_movie.add(title)
dali_movie.add(title2, Placement_Mode.AFTER, 2, title)

subtitle = dali_movie.subtitle("Je suis le sours-titre", 2)
dali_movie.add(subtitle, Placement_Mode.FROM, None, clip1a)

#dali_movie.export()