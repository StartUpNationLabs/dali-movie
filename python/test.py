from dali_movie.dali_movie import Dali_movie, MODE, ANCHOR_TYPE
from moviepy.audio.AudioClip import AudioClip

#INIT
font_path = "./dali_movie/resources/arial.TTF"
dali_movie = Dali_movie(font_path)

#SCRIPT
clip1 = dali_movie.importVideo("clip1", "../data/video1.mp4")
clip1a = dali_movie.cut("clip1a", clip1, 3, 4)
dali_movie.add(clip1, offset=2)
dali_movie.add(clip1a, mode=MODE.START, anchor_type="after", offset=2, reference=clip1)
print(dali_movie)

dali_movie.export("./output.mp4")