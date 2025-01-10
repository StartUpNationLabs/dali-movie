from dali_movie.dali_movie import Dali_movie, MODE, ANCHOR_TYPE
from moviepy.audio.AudioClip import AudioClip

#INIT
font_path = "./dali_movie/resources/arial.TTF"
dali_movie = Dali_movie(font_path)

#SCRIPT
clip1 = dali_movie.importVideo("./clip1.mp4")
introSound = dali_movie.importAudio("intro_sound.mp3")
clip1a = dali_movie.cut(clip1, 19, 107)
clip1b = dali_movie.cut_start(clip1, 14224)
clip1c = dali_movie.cut_end(clip1, 23)
dali_movie.add(clip1)
dali_movie.add(clip1a, mode=MODE.START, anchor_type="after", offset=2, reference=clip1)
dali_movie.add(clip1b, mode=MODE.END, anchor_type="before", offset=3, reference=clip1)
dali_movie.add(clip1c, mode=MODE.START, anchor_type="after", reference=clip1a)
dali_movie.add(introSound)
introSound_2s_1m12s = dali_movie.cut(introSound, 2, 72)
dali_movie.add(introSound_2s_1m12s)
dali_movie.add(introSound, mode=MODE.START, anchor_type="after", offset=2, reference=clip1)
introSound_start_1m12s = dali_movie.cut_start(introSound, 72)
dali_movie.add(introSound_start_1m12s, mode=MODE.START, anchor_type="at", reference=clip1)
dali_movie.add(introSound, mode=MODE.END, anchor_type="before", offset=3, reference=clip1)
introSound_end_26s = dali_movie.cut_end(introSound, 26)
dali_movie.add(introSound_end_26s, mode=MODE.END, anchor_type="before", offset=3, reference=clip1)
dali_movie.add(introSound, mode=MODE.START, anchor_type="after", reference=clip1a)

dali_movie.export("./output.mp4")
