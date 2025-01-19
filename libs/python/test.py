from dali_movie.dali_movie import Dali_movie, MODE

#INIT
font_path = "../../dist/apps/dali-server/src/assets/arial.TTF"
dali_movie = Dali_movie(font_path)

from dali_movie.dali_movie import Dali_movie, MODE, ANCHOR_TYPE
from moviepy.audio.AudioClip import AudioClip

#INIT
font_path = "../../dist/apps/dali-server/src/assets/futura.otf"
dali_movie = Dali_movie(font_path)

#SCRIPT
clip1 = dali_movie.importVideo("video_mp4", "../../data/video.mp4")
clip2 = dali_movie.importVideo("video_mp4", "../../data/video.mp4")
bgMusic = dali_movie.importAudio("bgMusic", "../../data/audio.mp3")

introScene = dali_movie.cut_start("introScene", clip1, 4)
transitionScene = dali_movie.cut("transitionScene", clip2, 1, 2)
dali_movie.add(introScene)
dali_movie.add(transitionScene, mode=MODE.START, anchor_type="after", reference=introScene)
transitionText = dali_movie.text("transitionText", "\"Transitioning...\"", duration=6)
dali_movie.add(transitionText, mode=MODE.START, anchor_type="at", reference=introScene)
dali_movie.add(bgMusic, mode=MODE.START, anchor_type="at", reference=introScene)

dali_movie.export()


