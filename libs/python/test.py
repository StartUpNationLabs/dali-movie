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
video_mp4 = dali_movie.importVideo("video_mp4", "../../data/video.mp4")
dali_movie.add(video_mp4)
dali_movie.add(video_mp4, mode=MODE.END, anchor_type="before", reference=video_mp4)

dali_movie.export()

