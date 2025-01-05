from dali_movie.dali_movie import Dali_movie
from moviepy.audio.AudioClip import AudioClip

FONT_PATH = "./dali_movie/resources/arial.TTF"

dali_movie = Dali_movie()
clip1 = dali_movie.importVideo("../data/video1.mp4")
clip1a = dali_movie.cutStart(clip1 ,2)

audio1 = dali_movie.importAudio("../data/audio.mp3")

titre1 = dali_movie.title("JE SUIS LE TITRE", duration=4)

dali_movie.add(titre1)
dali_movie.add(clip1)
dali_movie.add(clip1a)

dali_movie.add(audio1)

dali_movie.export()